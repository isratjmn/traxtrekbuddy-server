/*
  Warnings:

  - You are about to drop the column `activities` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `budget` on the `trips` table. All the data in the column will be lost.
  - Added the required column `description` to the `trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itinerary` to the `trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travelType` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trips" DROP COLUMN "activities",
DROP COLUMN "budget",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "itinerary" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "photos" TEXT,
ADD COLUMN     "travelType" TEXT NOT NULL;
