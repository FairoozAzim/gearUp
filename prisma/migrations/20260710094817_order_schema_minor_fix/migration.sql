/*
  Warnings:

  - You are about to drop the column `end_date` on the `orders` table. All the data in the column will be lost.
  - Made the column `return_date` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "end_date",
ADD COLUMN     "returned_on" DATE,
ALTER COLUMN "return_date" SET NOT NULL;
