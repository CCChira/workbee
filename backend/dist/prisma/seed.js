"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=seed.js.map