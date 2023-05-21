import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
    imports: [],
  providers: [ProductService,CloudinaryService],
  controllers: [ProductController],
})
export class ProductModule {}
