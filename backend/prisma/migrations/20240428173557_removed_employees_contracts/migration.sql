/*
  Warnings:

  - You are about to drop the column `contractId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_ContractToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_contractId_fkey";

-- DropForeignKey
ALTER TABLE "_ContractToUser" DROP CONSTRAINT "_ContractToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContractToUser" DROP CONSTRAINT "_ContractToUser_B_fkey";

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "contractId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "contractId";

-- DropTable
DROP TABLE "_ContractToUser";

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;
