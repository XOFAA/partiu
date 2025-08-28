import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/database/PrismaService';
import { WhatsappService } from 'src/notification/whatsapp.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService,PrismaService,WhatsappService],
})
export class UsersModule {}
