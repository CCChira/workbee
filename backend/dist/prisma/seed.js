"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
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
        if (i < 20) {
            await prisma.user.create({
                data: {
                    email: `employee${i}@example.com`,
                    name: `Employee ${i}`,
                    password: commonPassword,
                    role: 'EMPLOYEE',
                },
            });
        }
        else if (i < 40) {
            await prisma.user.create({
                data: {
                    email: `client${i}@example.com`,
                    name: `Client ${i}`,
                    password: commonPassword,
                    role: 'CLIENT',
                },
            });
        }
    }
    const specialUser = await prisma.user.create({
        data: {
            email: 'clientSpecial@client.com',
            password: commonPassword,
            role: 'CLIENT',
            name: 'Client Special',
        },
    });
    const locations = [
        {
            name: 'Cluj Business Center',
            address: 'Strada Dorobanților 14-16, Cluj-Napoca 400117',
            latitude: 46.769379,
            longitude: 23.5899542,
        },
        {
            name: 'Sigma Business Park',
            address: 'Calea Turzii 178K, Cluj-Napoca 400495',
            latitude: 46.749245,
            longitude: 23.585616,
        },
        {
            name: 'The Office',
            address: 'Bulevardul 21 Decembrie 1989 nr. 77, Cluj-Napoca 400604',
            latitude: 46.77121,
            longitude: 23.623635,
        },
        {
            name: 'United Business Center',
            address: 'Strada Alexandru Vaida Voievod 53B, Cluj-Napoca 400436',
            latitude: 46.771984,
            longitude: 23.612319,
        },
    ];
    const taskTemplates = [
        {
            title: 'Office Floor Cleaning',
            necessaryWorkers: 2,
            necessaryTools: ['Mop', 'Bucket', 'Detergent'],
        },
        {
            title: 'Window Cleaning',
            necessaryWorkers: 1,
            necessaryTools: ['Squeegee', 'Window Cleaner', 'Ladder'],
        },
        {
            title: 'Bathroom Sanitization',
            necessaryWorkers: 2,
            necessaryTools: ['Disinfectant', 'Scrubbing Brush', 'Gloves'],
        },
        {
            title: 'Kitchen Deep Cleaning',
            necessaryWorkers: 3,
            necessaryTools: ['Degreaser', 'Scraper', 'Sponge', 'Detergent'],
        },
        {
            title: 'Carpet Shampooing',
            necessaryWorkers: 2,
            necessaryTools: ['Carpet Cleaner', 'Shampoo', 'Vacuum'],
        },
    ];
    const contract = await prisma.contract.create({
        data: {
            title: 'Servicii curatenie',
            clientId: specialUser.id,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
        await Promise.all(taskTemplates.map((taskTemplate) => prisma.taskTemplate.create({
            data: {
                title: taskTemplate.title,
                necessaryWorkers: taskTemplate.necessaryWorkers,
                necessaryTools: taskTemplate.necessaryTools,
                contractId: contract.id,
            },
        })));
        await Promise.all(locations.map(async (location) => {
            const locationResponse = await prisma.location.create({
                data: {
                    name: location.name,
                    address: location.address,
                    latitude: location.latitude,
                    longitude: location.longitude,
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
                                accessMode: client_1.AccessMode.STAIRS,
                            },
                        });
                        break;
                    case 1:
                        await prisma.room.create({
                            data: {
                                name: `Room ${i}-${j}`,
                                locationId: locationResponse.id,
                                accessMode: client_1.AccessMode.ELEVATOR,
                            },
                        });
                        break;
                    case 2:
                        await prisma.room.create({
                            data: {
                                name: `Room ${i}-${j}`,
                                locationId: locationResponse.id,
                                accessMode: client_1.AccessMode.RAMP,
                            },
                        });
                        break;
                    case 3:
                        await prisma.room.create({
                            data: {
                                name: `Room ${i}-${j}`,
                                locationId: locationResponse.id,
                                accessMode: client_1.AccessMode.RAMP,
                            },
                        });
                        break;
                    default:
                        await prisma.room.create({
                            data: {
                                name: `Room ${i}-${j}`,
                                locationId: locationResponse.id,
                                accessMode: client_1.AccessMode.STAIRS,
                            },
                        });
                }
            }
        }));
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
//# sourceMappingURL=seed.js.map