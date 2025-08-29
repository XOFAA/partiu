import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { randomInt } from 'crypto';
import { PrismaService } from 'src/database/PrismaService';
import { WhatsappService } from 'src/notification/whatsapp.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private whatsapp: WhatsappService) {}

async register(email: string, phone?: string, name?: string) {
  const existingUser = await this.prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new BadRequestException('Usuário já existe');
  }

  const user = await this.prisma.user.create({
    data: { email, phone, name, role: UserRole.USER },
  });

  return { message: 'Usuário cadastrado com sucesso', user };
}

async requestCode(identifier: string) {
  // tenta achar usuário pelo email ou pelo telefone
  const user = await this.prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  });

  if (!user) throw new BadRequestException('Usuário não encontrado');

  // gera código
  const code = String(randomInt(100000, 999999));
  await this.prisma.authCode.create({
    data: {
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  // envia por WhatsApp se tiver telefone, senão por email
  if (user.phone) {
    await this.whatsapp.sendCode(user.phone, code);
  } else {
    // aqui você poderia ter um EmailService
    console.log(`📧 Código enviado por email para ${user.email}: ${code}`);
  }

  return { message: 'Código enviado com sucesso' };
}


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