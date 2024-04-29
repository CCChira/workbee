import { accessMode, PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roundsOfHashing = 10;
  const commonPassword = await bcrypt.hash('password', roundsOfHashing);

  for (let i = 1; i <= 40; i++) {
    if (i == 10) {
      await prisma.user.create({
        data: {
          email: `admin10@example.com`,
          name: `Admin User 10`,
          password: commonPassword,
          role: 'ADMIN',
        },
      });
    }
    await prisma.user.upsert({
      where: {
        email: `admin${i != 10 ? Math.floor(Math.random() + 100 / i) : i}@example.com`,
      },
      update: {
        email: `admin${i}@example.com`,
        name: `Admin User ${i}`,
        password: commonPassword,
        role: i < 20 ? 'ADMIN' : 'CLIENT',
      },
      create: {
        email: `${i < 20 ? 'admin' : 'client'}${i != 10 ? Math.floor(Math.random() + 40 + i) : i}@example.com`,
        name: `${i < 20 ? 'Admin' : 'Client'} User ${i}`,
        password: commonPassword,
        role: i < 20 ? 'ADMIN' : 'CLIENT',
      },
    });
  }
  const specialUser = await prisma.user.create({
    data: {
      email: 'clientSpecial@client.com',
      password: commonPassword,
      role: 'CLIENT',
      name: 'Client Special',
    },
  });
  const employees: User[] = [];
  for (let i = 0; i < 20; i++) {
    const response = await prisma.user.create({
      data: {
        email: `employee${i}@employee.com`,
        password: commonPassword,
        role: 'EMPLOYEE',
        name: 'Employee' + i,
      },
    });
    employees.push(response);
  }
  const locations = [
    {
      name: 'Cluj Business Center',
      address: 'Strada Dorobanților 14-16, Cluj-Napoca 400117',
      coords: '46.769379, 23.5899542',
    },
    {
      name: 'Sigma Business Park',
      address: 'Calea Turzii 178K, Cluj-Napoca 400495',
      coords: '46.749245, 23.585616',
    },
    {
      name: 'The Office',
      address: 'Bulevardul 21 Decembrie 1989 nr. 77, Cluj-Napoca 400604',
      coords: '46.771210, 23.623635',
    },
    {
      name: 'United Business Center',
      address: 'Strada Alexandru Vaida Voievod 53B, Cluj-Napoca 400436',
      coords: '46.771984, 23.612319',
    },
  ];

  const contract = await prisma.contract.create({
    data: {
      title: 'Servicii curatenie',
      clientId: specialUser.id,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      startDate: Date.now().toString(),
      endDate: Date.now().toString(),
    },
  });
  for (let i = 0; i < 20; i++) {
    const contract = await prisma.contract.create({
      data: {
        title: `Contract ${i}`,
        clientId: specialUser.id,
        description: `Description for contract ${i} orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerc`,
        startDate: Date.now().toString(),
        endDate: Date.now().toString(),
      },
    });
    await Promise.all(
      locations.map(async (location) => {
        const locationResponse = await prisma.location.create({
          data: {
            name: location.name,
            address: location.address,
            coords: location.coords,
            contractId: contract.id,
          },
        });
        for (let j = 0; j < 20; j++) {
          switch (j % 4) {
            case 0:
              await prisma.room.create({
                data: {
                  name: `Room ${i}-${j}`,
                  locationId: locationResponse.id,
                  accessMode: accessMode.STAIRS,
                },
              });
            case 1:
              await prisma.room.create({
                data: {
                  name: `Room ${i}-${j}`,
                  locationId: locationResponse.id,
                  accessMode: accessMode.ELEVATOR,
                },
              });
              break;
            case 2:
              await prisma.room.create({
                data: {
                  name: `Room ${i}-${j}`,
                  locationId: locationResponse.id,
                  accessMode: accessMode.RAMP,
                },
              });
              break;
            case 3:
              await prisma.room.create({
                data: {
                  name: `Room ${i}-${j}`,
                  locationId: locationResponse.id,
                  accessMode: accessMode.RAMP,
                },
              });
              break;
            default:
              await prisma.room.create({
                data: {
                  name: `Room ${i}-${j}`,
                  locationId: locationResponse.id,
                  accessMode: accessMode.STAIRS,
                },
              });
          }
        }
      }),
    );
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
