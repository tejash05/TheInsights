/*
  Warnings:

  - A unique constraint covering the columns `[shopifyLineId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopifyLineId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."OrderItem" ADD COLUMN     "shopifyLineId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_shopifyLineId_key" ON "public"."OrderItem"("shopifyLineId");
