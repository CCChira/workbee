const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  // Fetch the contract
  await prisma.taskAssignment.deleteMany({});
  await prisma.taskInstance.deleteMany({});
  await prisma.taskSchedule.deleteMany({});
  await prisma.taskTemplate.deleteMany({});
  await prisma.tools.deleteMany({});
  await prisma.inviteCodes.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.contract.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.request.deleteMany({});
  await prisma.user.deleteMany({});
}

seed()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
