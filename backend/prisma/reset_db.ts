import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function seed() {
  // Fetch the contract
  const models = [
    'User',
    'Contract',
    'TaskTemplate',
    'TaskSchedule',
    'TaskInstance',
    'Vehicle',
    'TaskAssignment',
    'Location',
    'Room',
    'Image',
    'Request',
    'Tools',
    'InviteCodes',
  ];

  for (const model in models) {
    await prisma[model].deleteMany();
  }
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  async function insertData() {
    for (const model in data) {
      for (const record of data[model]) {
        await prisma[model].create({
          data: record,
        });
      }
    }
    await prisma.$disconnect();
    console.log('Data inserted successfully');
  }

  insertData().catch((error) => {
    console.error('Error inserting data:', error);
    prisma.$disconnect();
  });
}

seed()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
