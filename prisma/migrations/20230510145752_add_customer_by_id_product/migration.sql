-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdByCustomerId" INTEGER NOT NULL DEFAULT 16,
ADD COLUMN     "createdByRole" TEXT NOT NULL DEFAULT 'admin';

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdByCustomerId_fkey" FOREIGN KEY ("createdByCustomerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
