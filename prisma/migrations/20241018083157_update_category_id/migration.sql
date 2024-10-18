/*
  Warnings:

  - You are about to drop the column `category` on the `assets` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assets` DROP COLUMN `category`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Assets` ADD CONSTRAINT `Assets_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
