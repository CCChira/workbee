import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function seed() {
  // Fetch the contract
  const models = [
    'User',
    'Tools',
    'InviteCodes',
    'TaskTemplate',
    'TaskSchedule',
    'TaskInstance',
    'Vehicle',
    'TaskAssignment',
    'Contract',
    'Location',
    'Room',
    'Image',
    'Request',
  ];

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
