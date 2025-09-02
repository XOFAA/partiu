import { Module } from '@nestjs/common';
import { TicketTypesService } from './ticket-types.service';
import { TicketTypesController } from './ticket-types.controller';
import { PrismaService } from 'src/database/PrismaService';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  controllers: [TicketTypesController],
  providers: [TicketTypesService,PrismaService,StripeService],
})
export class TicketTypesModule {}
