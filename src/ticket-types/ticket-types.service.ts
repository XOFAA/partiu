import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';

@Injectable()
export class TicketTypesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateTicketTypeDto) {
    return this.prisma.ticketType.create({ data });
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
