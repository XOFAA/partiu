// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

@Post('login')
@ApiOperation({ summary: 'Login com código (email ou celular)' })
login(@Body() body: { identifier: string; code: string }) {
  return this.authService.login(body.identifier, body.code);
}

}
