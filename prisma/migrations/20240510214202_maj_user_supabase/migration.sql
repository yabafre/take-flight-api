/*
  Warnings:

  - You are about to drop the column `name` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Provider` DROP COLUMN `name`,
    DROP COLUMN `providerId`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `password`,
    ADD COLUMN `aud` VARCHAR(191) NULL,
    ADD COLUMN `encrypted_password` VARCHAR(191) NULL,
    ADD COLUMN `role` VARCHAR(191) NULL;
