/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "coffeeBeansGain" INTEGER DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "xpGain" INTEGER DEFAULT 0,
ALTER COLUMN "category" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_name_key" ON "MenuItem"("name");
