/*
  Warnings:

  - You are about to drop the column `adminId` on the `trips` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_adminId_fkey";

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "adminId";
