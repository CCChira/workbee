-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT DEFAULT 'test@test.com',
    "phoneNumber" TEXT DEFAULT '0700000000',
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "name" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);
