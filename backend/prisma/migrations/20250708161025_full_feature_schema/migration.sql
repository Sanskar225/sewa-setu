/*
  Warnings:

  - Made the column `latitude` on table `ProviderProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `ProviderProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProviderProfile" ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

-- CreateIndex
CREATE INDEX "ProviderProfile_latitude_longitude_idx" ON "ProviderProfile"("latitude", "longitude");
