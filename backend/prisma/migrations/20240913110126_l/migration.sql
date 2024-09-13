/*
  Warnings:

  - You are about to drop the column `availability` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileVisibility` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `studyPreference` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subjects` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "availability",
DROP COLUMN "bio",
DROP COLUMN "location",
DROP COLUMN "major",
DROP COLUMN "profilePicture",
DROP COLUMN "profileVisibility",
DROP COLUMN "studyPreference",
DROP COLUMN "subjects",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "major" TEXT NOT NULL,
    "subjects" TEXT[],
    "availability" TEXT[],
    "location" TEXT NOT NULL,
    "bio" TEXT,
    "studyPreference" TEXT,
    "profileVisibility" BOOLEAN NOT NULL DEFAULT true,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
