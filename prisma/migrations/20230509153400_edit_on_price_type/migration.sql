-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "cartId" INTEGER;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "image" DROP NOT NULL;
