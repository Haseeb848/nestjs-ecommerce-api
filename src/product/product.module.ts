import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
