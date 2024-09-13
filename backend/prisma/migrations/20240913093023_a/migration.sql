/*
  Warnings:

  - You are about to drop the column `rating` on the `User` table. All the data in the column will be lost.
  - The `availability` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "rating",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "profileVisibility" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "studyPreference" TEXT,
DROP COLUMN "availability",
ADD COLUMN     "availability" TEXT[];
