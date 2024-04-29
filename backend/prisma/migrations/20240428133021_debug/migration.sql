/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `InviteCodes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InviteCodes_email_key" ON "InviteCodes"("email");
