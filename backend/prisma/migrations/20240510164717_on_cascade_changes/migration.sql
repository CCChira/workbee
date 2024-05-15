-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_createdById_fkey";

-- DropForeignKey
ALTER TABLE "TaskSchedule" DROP CONSTRAINT "TaskSchedule_roomId_fkey";

-- AddForeignKey
ALTER TABLE "TaskSchedule" ADD CONSTRAINT "TaskSchedule_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
