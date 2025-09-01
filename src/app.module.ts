import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { TicketTypesModule } from './ticket-types/ticket-types.module';

@Module({
  imports: [UsersModule,AuthModule, EventsModule, TicketTypesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
