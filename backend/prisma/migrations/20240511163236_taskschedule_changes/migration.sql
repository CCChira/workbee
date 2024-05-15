/*
  Warnings:

  - The `frequency` column on the `TaskSchedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TaskSchedule" DROP COLUMN "frequency",
ADD COLUMN     "frequency" INTEGER[];
