import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { randomInt } from 'crypto';
import { PrismaService } from 'src/database/PrismaService';
import { WhatsappService } from 'src/notification/whatsapp.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private whatsapp: WhatsappService) {}

 async register(email: string, phone?: string, name?: string) {
    // cria ou pega usuário
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { email, phone, name, role: UserRole.USER },
      });
    }

    // gera código
    const code = String(randomInt(100000, 999999));
    await this.prisma.authCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // aqui você enviaria o código por email/WhatsApp
        if (phone) {
      await this.whatsapp.sendCode(phone, code);
    }
    console.log(`📨 Código para ${email}: ${code}`);

    return { message: 'Código enviado para seu email/WhatsApp' };
  }

  // 2. Confirmação do código
  async confirmCode(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('Usuário não encontrado');

    const authCode = await this.prisma.authCode.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!authCode) throw new BadRequestException('Código inválido ou expirado');

    await this.prisma.authCode.update({
      where: { id: authCode.id },
      data: { used: true },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { confirmed: true },
    });

    // aqui você pode gerar o JWT e retornar
    return { message: 'Conta confirmada com sucesso!' };
  }

  // métodos normais (somente usuários confirmados)
  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  update(id: string, data: { name?: string; phone?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}