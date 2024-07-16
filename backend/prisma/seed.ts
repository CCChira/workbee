import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roundsOfHashing = 10;
  const commonPassword = await bcrypt.hash('password', roundsOfHashing);
  const targetDate = new Date('2024-07-16T21:00:00.000Z');
  const updatedTaskInstances = await prisma.taskInstance.updateMany({
    where: {
      date: {
        gte: targetDate,
      },
    },
    data: {
      status: 'IN_PROGRESS',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
