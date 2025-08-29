// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

async login(identifier: string, code: string) {
  // procura pelo que foi enviado (email OU celular)
  const user = await this.prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  });

  if (!user) throw new UnauthorizedException('Usuário não encontrado');

  const authCode = await this.prisma.authCode.findFirst({
    where: {
      userId: user.id,
      code,
      expiresAt: { gt: new Date() }, // ainda válido
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!authCode) throw new BadRequestException('Código inválido ou expirado');

  // gera token JWT
  const payload = { sub: user.id, role: user.role };
  const token = await this.jwtService.signAsync(payload);

  // opcional: remover o código depois de usado
  await this.prisma.authCode.delete({ where: { id: authCode.id } });

  return { access_token: token, user };
}
}