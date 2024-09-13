/*
  Warnings:

  - Made the column `location` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `major` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "major" SET NOT NULL;
