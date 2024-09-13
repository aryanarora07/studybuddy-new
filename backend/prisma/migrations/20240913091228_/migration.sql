/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "availability" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "subjects" TEXT[];
