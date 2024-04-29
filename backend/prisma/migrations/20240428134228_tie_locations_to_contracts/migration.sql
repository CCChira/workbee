-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "contractId" INTEGER;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;
