/*
  Warnings:

  - The `itinerary` column on the `trips` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `travelType` column on the `trips` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "trips" DROP COLUMN "itinerary",
ADD COLUMN     "itinerary" TEXT[],
DROP COLUMN "travelType",
ADD COLUMN     "travelType" TEXT[];
