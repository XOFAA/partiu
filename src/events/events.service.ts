// src/events/events.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private stripe: StripeService,
  ) {}

  async create(data: CreateEventDto) {
    // 1. Cria produto no Stripe
    const product = await this.stripe.createProduct(
      data.name,
      `Evento em ${data.date}`,
    );

    // 2. Salva evento no banco com stripeProductId
    return this.prisma.event.create({
      data: {
        ...data,
        stripeProductId: product.id,
      },
    });
  }

  findAll() {
    return this.prisma.event.findMany({
      include: { ticketTypes: true },
      orderBy: { date: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { ticketTypes: true },
    });
  }

  update(id: string, data: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}
