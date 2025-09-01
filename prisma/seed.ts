import { PrismaClient, UserRole } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // cria admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@eventos.com',
      name: 'Admin Master',
      phone: '5592993795370',
      role: UserRole.ADMIN,
    },
  });

  console.log('Admin criado:', admin);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
