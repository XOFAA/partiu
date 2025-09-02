// src/ticket-types/ticket-types.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';

@Injectable()
export class TicketTypesService {
  constructor(
    private prisma: PrismaService,
    private stripe: StripeService,
  ) {}

  async create(data: CreateTicketTypeDto) {
    // 1. Busca o evento para pegar stripeProductId
    const event = await this.prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event?.stripeProductId) {
      throw new Error('Evento não encontrado ou sem Stripe Product vinculado');
    }

    // 2. Cria o Price no Stripe
    const price = await this.stripe.createPrice(
      event.stripeProductId,
      data.price * 100, // Stripe trabalha em centavos
    );

    // 3. Salva no banco junto com stripePriceId
    return this.prisma.ticketType.create({
      data: {
        ...data,
        stripePriceId: price.id,
      },
    });
  }

  findAll() {
    return this.prisma.ticketType.findMany({
      include: { event: true },
      orderBy: { price: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.ticketType.findUnique({
      where: { id },
      include: { event: true },
    });
  }

  update(id: string, data: UpdateTicketTypeDto) {
    return this.prisma.ticketType.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.ticketType.delete({ where: { id } });
  }
}
