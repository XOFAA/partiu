// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/database/PrismaService';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, PrismaService,JwtStrategy],
  controllers: [AuthController],  // 👈 coloca aqui
  exports: [AuthService],
})
export class AuthModule {}
