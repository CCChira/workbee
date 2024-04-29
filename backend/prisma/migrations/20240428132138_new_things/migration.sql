/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `InviteCodes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `InviteCodes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "accessMode" AS ENUM ('STAIRS', 'ELEVATOR', 'RAMP');

-- AlterTable
ALTER TABLE "InviteCodes" ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TaskTemplate" ADD COLUMN     "contractId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contractId" INTEGER;

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "coords" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "accessMode" "accessMode" NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContractToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContractToUser_AB_unique" ON "_ContractToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ContractToUser_B_index" ON "_ContractToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "InviteCodes_email_key" ON "InviteCodes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InviteCodes_phoneNumber_key" ON "InviteCodes"("phoneNumber");

-- AddForeignKey
ALTER TABLE "TaskTemplate" ADD CONSTRAINT "TaskTemplate_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractToUser" ADD CONSTRAINT "_ContractToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractToUser" ADD CONSTRAINT "_ContractToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
