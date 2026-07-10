/*
  Warnings:

  - Added the required column `customer_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "customer_id" TEXT NOT NULL,
ADD COLUMN     "item_id" TEXT NOT NULL,
ALTER COLUMN "pickup_date" SET DATA TYPE DATE,
ALTER COLUMN "end_date" SET DATA TYPE DATE,
ALTER COLUMN "return_date" DROP NOT NULL,
ALTER COLUMN "return_date" SET DATA TYPE DATE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "gearItems"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;
