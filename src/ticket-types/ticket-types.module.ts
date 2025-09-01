import { Module } from '@nestjs/common';
import { TicketTypesService } from './ticket-types.service';
import { TicketTypesController } from './ticket-types.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [TicketTypesController],
  providers: [TicketTypesService,PrismaService],
})
export class TicketTypesModule {}
