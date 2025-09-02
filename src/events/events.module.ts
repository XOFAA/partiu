import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/database/PrismaService';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService,PrismaService,StripeService],
})
export class EventsModule {}
