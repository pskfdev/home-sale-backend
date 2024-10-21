-- DropForeignKey
ALTER TABLE `assets` DROP FOREIGN KEY `Assets_categoryId_fkey`;

-- AddForeignKey
ALTER TABLE `Assets` ADD CONSTRAINT `Assets_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
