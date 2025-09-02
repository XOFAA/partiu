// src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private stripe: StripeService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // 1. Buscar todos os TicketTypes do pedido
    const ticketTypes = await this.prisma.ticketType.findMany({
      where: { id: { in: dto.items.map((i) => i.ticketTypeId) } },
    });

    if (ticketTypes.length !== dto.items.length) {
      throw new Error('Um ou mais tipos de ingresso não foram encontrados');
    }

    // 2. Calcular valor total em centavos
    const total = dto.items.reduce((acc, item) => {
      const ticketType = ticketTypes.find((t) => t.id === item.ticketTypeId);
      return acc + (ticketType!.price * item.quantity * 100);
    }, 0);

    // 3. Criar PaymentIntent no Stripe
    const paymentIntent = await this.stripe.createPaymentIntent(total, 'brl', [
      'card',
      'pix',
      'boleto',
    ]);

    // 4. Criar Order no banco
    const order = await this.prisma.order.create({
      data: {
        userId,
        total: total / 100, // salvar em reais
        status: 'PENDING',
        payments: {
          create: {
            userId,
            status: 'PENDING',
            stripeId: paymentIntent.id,
          },
        },
        tickets: {
          createMany: {
            data: dto.items.flatMap((item) => {
              const ticketType = ticketTypes.find(
                (t) => t.id === item.ticketTypeId,
              )!;
              return Array.from({ length: item.quantity }).map(() => ({
                ticketTypeId: ticketType.id,
                eventId: ticketType.eventId,
                qrCode: randomUUID(),
                used: false,
              }));
            }),
          },
        },
      },
      include: { payments: true, tickets: true },
    });

    // 5. Retornar pedido + client_secret
    return {
      order,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { tickets: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    return this.prisma.order.findFirst({
      where: { id, userId },
      include: { tickets: true, payments: true },
    });
  }
}
