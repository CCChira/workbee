"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const roundsOfHashing = 10;
    const commonPassword = await bcrypt.hash('password', roundsOfHashing);
    for (let i = 1; i <= 40; i++) {
        await prisma.user.upsert({
            where: { email: `admin${i != 10 ? Math.random() + 100 : i}@example.com` },
            update: {
                email: `admin${i}@example.com`,
                name: `Admin User ${i}`,
                password: commonPassword,
                role: i < 20 ? 'ADMIN' : 'CLIENT',
            },
            create: {
                email: `admin${Math.random() + 100}@example.com`,
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
//# sourceMappingURL=seed.js.map