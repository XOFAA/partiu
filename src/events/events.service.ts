// src/events/events.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateEventDto) {
    return this.prisma.event.create({ data });
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
