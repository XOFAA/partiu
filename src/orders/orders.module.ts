import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'src/database/PrismaService';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService,PrismaService,StripeService],
})
export class OrdersModule {}
