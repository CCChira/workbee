-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "TaskInstance" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "TaskSchedule" ALTER COLUMN "status" SET DEFAULT 'PENDING';
