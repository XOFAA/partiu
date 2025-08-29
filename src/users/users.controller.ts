// src/users/users.controller.ts
import { 
  Body, Controller, Delete, Get, Patch, Post, Req, UseGuards 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🚀 Cadastro inicial (sem código ainda)
  @Post('register')
  @ApiOperation({ summary: 'Cadastrar usuário' })
  register(@Body() body: { email: string; phone?: string; name?: string }) {
    return this.usersService.register(body.email, body.phone, body.name);
  }

@Post('request-code')
@ApiOperation({ summary: 'Solicitar código para login (WhatsApp ou Email)' })
requestCode(@Body() body: { identifier: string }) {
  return this.usersService.requestCode(body.identifier);
}

  // ✅ Rotas abaixo só para quem já estiver logado
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()

  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário logado' })
  getMe(@Req() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar dados do usuário logado' })
  updateMe(@Req() req, @Body() body: { name?: string; phone?: string }) {
    return this.usersService.update(req.user.userId, body);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Excluir conta do usuário logado' })
  removeMe(@Req() req) {
    return this.usersService.remove(req.user.userId);
  }

  // 🔒 Apenas ADMIN pode listar todos os usuários
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos os usuários (ADMIN)' })
  findAll() {
    return this.usersService.findAll();
  }
}
