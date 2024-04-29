/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'INCOMPLETE', 'REQUESTED_CANCEL', 'VERIFIED');

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_taskTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "TaskAssignment" DROP CONSTRAINT "TaskAssignment_taskId_fkey";

-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "TaskSchedule" (
    "id" SERIAL NOT NULL,
    "taskTemplateId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "dayOfWeek" INTEGER[],
    "frequency" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "TaskSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskInstance" (
    "id" SERIAL NOT NULL,
    "taskScheduleId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'UNASSIGNED',
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "loadCapacity" DOUBLE PRECISION NOT NULL,
    "seats" INTEGER NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskSchedule" ADD CONSTRAINT "TaskSchedule_taskTemplateId_fkey" FOREIGN KEY ("taskTemplateId") REFERENCES "TaskTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskInstance" ADD CONSTRAINT "TaskInstance_taskScheduleId_fkey" FOREIGN KEY ("taskScheduleId") REFERENCES "TaskSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "TaskInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
