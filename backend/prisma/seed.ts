import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userIds = [
    'ae926bb0-89fc-4e97-8ec5-0ea811c98211',
    '4c827c42-e6ef-4908-93a5-9240b5c47e6c',
    '3317febf-3889-4123-95ed-6698134d84f4',
    '5a6d7c2c-c510-4635-80da-b4226cabfed6',
    '49ccff70-2ef8-432d-bf22-704b7ff4a7be',
    'c63eba1b-6aff-4184-a1db-2a532372aa76',
    '52b14406-775b-41c0-a08a-bff6cbf3e9ec',
    'c1f38c13-023f-4f5a-9baa-54b211d82cb7',
    'a56dce88-c8c8-4117-b58e-526ad8d31a93',
  ];

  async function getAllUserData() {
    try {
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });
      console.log(users);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      await prisma.$disconnect();
    }
  }

  getAllUserData();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
