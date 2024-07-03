import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const userIds = Array.from({ length: 10 }, () => uuidv4());

  const messages = Array.from({ length: 1000 }, () => {
    const senderId = faker.helpers.arrayElement(userIds);
    const receiverId = faker.helpers.arrayElement(
      userIds.filter((id) => id !== senderId),
    );
    return {
      id: uuidv4(),
      content: faker.lorem.sentence(),
      timestamp: faker.date.past(),
      senderId: senderId,
      receiverId: receiverId,
      readStatus: false,
    };
  });
  const adminMessages = Array.from({ length: 1000 }, () => {
    const receiverId = faker.helpers.arrayElement(
      userIds.filter((id) => id !== '452e4d27-e814-41c1-a07b-62fdbb22cccc'),
    );
    return {
      id: uuidv4(),
      content: faker.lorem.sentence(),
      timestamp: faker.date.past(),
      senderId: '452e4d27-e814-41c1-a07b-62fdbb22cccc',
      receiverId: receiverId,
      readStatus: false,
    };
  });
  const adminMessages2 = Array.from({ length: 1000 }, () => {
    return {
      id: uuidv4(),
      content: faker.lorem.sentence(),
      timestamp: faker.date.past(),
      senderId: '452e4d27-e814-41c1-a07b-62fdbb22cccc',
      receiverId: '157b7eb1-0f77-41f5-acd6-fdb1cc0b9b94',
      readStatus: false,
    };
  });
  const adminMessages3 = Array.from({ length: 1000 }, () => {
    const receiverId = faker.helpers.arrayElement(
      userIds.filter((id) => id !== '452e4d27-e814-41c1-a07b-62fdbb22cccc'),
    );
    return {
      id: uuidv4(),
      content: faker.lorem.sentence(),
      timestamp: faker.date.past(),
      senderId: '452e4d27-e814-41c1-a07b-62fdbb22cccc',
      receiverId: '15f17008-4499-42cf-8d93-ebebe9b22a81',
      readStatus: false,
    };
  });
  const adminMessages4 = Array.from({ length: 1000 }, () => {
    const receiverId = faker.helpers.arrayElement(
      userIds.filter((id) => id !== '452e4d27-e814-41c1-a07b-62fdbb22cccc'),
    );
    return {
      id: uuidv4(),
      content: faker.lorem.sentence(),
      timestamp: faker.date.past(),
      senderId: '452e4d27-e814-41c1-a07b-62fdbb22cccc',
      receiverId: '1934886d-d4e5-49a9-965c-2755926c8f01',
      readStatus: false,
    };
  });
  const adminMessages5 = Array.from({ length: 1000 }, () => {
    const receiverId = faker.helpers.arrayElement(
      userIds.filter((id) => id !== '452e4d27-e814-41c1-a07b-62fdbb22cccc'),
    );
    return {
      id: uuidv4(),
      content: faker.lorem.sentence(),
      timestamp: faker.date.past(),
      senderId: '452e4d27-e814-41c1-a07b-62fdbb22cccc',
      receiverId: '198509dd-c885-466c-ac22-f9769a4041fe',
      readStatus: false,
    };
  });
  const totalMessages = [
    ...messages,
    ...adminMessages,
    ...adminMessages2,
    ...adminMessages3,
    ...adminMessages4,
    ...adminMessages5,
  ];
  await prisma.message.createMany({
    data: totalMessages,
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
