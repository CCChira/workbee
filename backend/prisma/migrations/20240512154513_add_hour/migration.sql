/*
  Warnings:

  - Added the required column `hour` to the `TaskInstance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hour` to the `TaskSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskInstance" ADD COLUMN     "hour" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaskSchedule" ADD COLUMN     "hour" TEXT NOT NULL;
