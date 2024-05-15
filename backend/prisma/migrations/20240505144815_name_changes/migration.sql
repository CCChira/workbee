/*
  Warnings:

  - Changed the type of `accessMode` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AccessMode" AS ENUM ('STAIRS', 'ELEVATOR', 'RAMP');

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "accessMode",
ADD COLUMN     "accessMode" "AccessMode" NOT NULL;

-- DropEnum
DROP TYPE "accessMode";
