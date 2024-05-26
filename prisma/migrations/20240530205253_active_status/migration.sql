-- CreateEnum
CREATE TYPE "UserActive" AS ENUM ('ACTIVATE', 'DEACTIVATE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isActive" "UserActive" NOT NULL DEFAULT 'ACTIVATE';
