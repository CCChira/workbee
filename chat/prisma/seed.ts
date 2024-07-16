import { PrismaClient, Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const userIds = [
    'ae926bb0-89fc-4e97-8ec5-0ea811c98211',
    '4c827c42-e6ef-4908-93a5-9240b5c47e6c',
    '3317febf-3889-4123-95ed-6698134d84f4', // admin
    '5a6d7c2c-c510-4635-80da-b4226cabfed6',
    '49ccff70-2ef8-432d-bf22-704b7ff4a7be',
    'c63eba1b-6aff-4184-a1db-2a532372aa76',
    '52b14406-775b-41c0-a08a-bff6cbf3e9ec',
    'c1f38c13-023f-4f5a-9baa-54b211d82cb7',
    'a56dce88-c8c8-4117-b58e-526ad8d31a93',
  ];
  const users = [
    {
      id: 'ae926bb0-89fc-4e97-8ec5-0ea811c98211',
      email: '3pillarglobal@gmail.com',
      phoneNumber: '070000000',
      role: Role.CLIENT,
      name: '3Pillar Global',
    },
    {
      id: 'c1f38c13-023f-4f5a-9baa-54b211d82cb7',
      email: 'arobstransilvaniasoftware@gmail.com',
      phoneNumber: '070000000',
      role: Role.CLIENT,
      name: 'Arobs Transilvania Software',
    },
    {
      id: 'a56dce88-c8c8-4117-b58e-526ad8d31a93',
      email: 'betfairromaniadevelopment@gmail.com',
      phoneNumber: '070000000',
      role: Role.CLIENT,
      name: 'Betfair Romania Development',
    },
    {
      id: '4c827c42-e6ef-4908-93a5-9240b5c47e6c',
      email: 'accenture@gmail.com',
      phoneNumber: '070000000',
      role: Role.CLIENT,
      name: 'Accenture',
    },
    {
      id: '3317febf-3889-4123-95ed-6698134d84f4',
      email: 'admin10@example.com',
      phoneNumber: '070000000',
      role: Role.ADMIN,
      name: 'Cristi',
    },
    {
      id: '5a6d7c2c-c510-4635-80da-b4226cabfed6',
      email: 'alexandrumoldovan@gmail.com',
      phoneNumber: '070000000',
      role: Role.EMPLOYEE,
      name: 'Alexandru Moldovan',
    },
    {
      id: '49ccff70-2ef8-432d-bf22-704b7ff4a7be',
      email: 'alinatoma@gmail.com',
      phoneNumber: '070000000',
      role: Role.EMPLOYEE,
      name: 'Alina Toma',
    },
    {
      id: '52b14406-775b-41c0-a08a-bff6cbf3e9ec',
      email: 'andreipopescu@gmail.com',
      phoneNumber: '070000000',
      role: Role.EMPLOYEE,
      name: 'Andrei Popescu',
    },
    {
      id: 'c63eba1b-6aff-4184-a1db-2a532372aa76',
      email: 'anamunteanu@gmail.com',
      phoneNumber: '070000000',
      role: Role.EMPLOYEE,
      name: 'Ana Munteanu',
    },
  ];
  // Create users
  await prisma.users.createMany({
    data: users,
  });
  // Create messages
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
      userIds.filter((id) => id !== '3317febf-3889-4123-95ed-6698134d84f4'),
    );
    return {
      id: uuidv4(),
      content: faker.lorem.sentence(),
      timestamp: faker.date.past(),
      senderId: '3317febf-3889-4123-95ed-6698134d84f4',
      receiverId: receiverId,
      readStatus: false,
    };
  });

  const adminMessages2 = Array.from({ length: 1000 }, () => {
    return {
      id: uuidv4(),
      content: faker.lorem.sentence(),
      timestamp: faker.date.past(),
      senderId: '3317febf-3889-4123-95ed-6698134d84f4',
      receiverId: 'ae926bb0-89fc-4e97-8ec5-0ea811c98211',
      readStatus: false,
    };
  });

  const totalMessages = [...messages, ...adminMessages, ...adminMessages2];

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
