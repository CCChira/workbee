/*
  Warnings:

  - You are about to drop the column `userId` on the `Contract` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_userId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
