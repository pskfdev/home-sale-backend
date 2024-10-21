/*
  Warnings:

  - You are about to drop the column `price` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the `assetsonwishlist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assetsId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assetsonwishlist` DROP FOREIGN KEY `AssetsOnWishlist_assetsId_fkey`;

-- DropForeignKey
ALTER TABLE `assetsonwishlist` DROP FOREIGN KEY `AssetsOnWishlist_wishlistId_fkey`;

-- AlterTable
ALTER TABLE `assets` DROP COLUMN `price`,
    ADD COLUMN `priceRent` INTEGER NULL,
    ADD COLUMN `priceSale` INTEGER NULL;

-- AlterTable
ALTER TABLE `wishlist` ADD COLUMN `assetsId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `assetsonwishlist`;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_assetsId_fkey` FOREIGN KEY (`assetsId`) REFERENCES `Assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
