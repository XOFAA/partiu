import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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

  // 🚀 Cadastro inicial → envia código por WhatsApp/Email
  @Post('register')
  @ApiOperation({ summary: 'Cadastrar usuário e enviar código de confirmação' })
  register(@Body() body: { email: string; phone?: string; name?: string }) {
    return this.usersService.register(body.email, body.phone, body.name);
  }

  // 🚀 Confirmação do código
  @Post('confirm')
  @ApiOperation({ summary: 'Confirmar código recebido e ativar conta' })
  confirm(@Body() body: { email: string; code: string }) {
    return this.usersService.confirmCode(body.email, body.code);
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
