import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roundsOfHashing = 10;
  const commonPassword = await bcrypt.hash('password', roundsOfHashing);

  for (let i = 1; i <= 40; i++) {
    await prisma.user.upsert({
      where: { email: `admin${i}@example.com` },
      update: {
        email: `admin${i}@example.com`,
        name: `Admin User ${i}`,
        password: commonPassword,
        role: i < 20 ? 'ADMIN' : 'CLIENT',
      },
      create: {
        email: `admin${i}@example.com`,
        name: `Admin User ${i}`,
        password: commonPassword,
        role: i < 20 ? 'ADMIN' : 'CLIENT',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
