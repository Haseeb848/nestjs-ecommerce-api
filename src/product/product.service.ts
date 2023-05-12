import { Injectable, ParseFloatPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Customer, Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  //   async create(createProductDto: CreateProductDto) {
  //     return this.prisma.product.create({ data: createProductDto });
  //   }

  async createProduct(createProductDto: CreateProductDto, user: any, file: Express.Multer.File) {
    const { customerId, role } = user;
    const {filename} = file;

      console.log('User ID:', customerId);
      console.log('User role:', role);

    const newProduct = {
      name: createProductDto.name,
      price: Number(createProductDto.price),
      image: filename,
      createdByCustomerId: customerId,
      createdByRole: role,
    };

    return this.prisma.product.create({
      data: newProduct,
    });
  }

  //   async create(
  //     createProductDto: CreateProductDto,
  //     // file: Express.Multer.File, // <-- Added file parameter
  //   ) {
  //     const { originalname, filename } = file;
  //     const image = filename;
  //     // const price = ParseFloat()
  //     const productData = {
  //       ...createProductDto,
  //       image,
  //     };
  //     return this.prisma.product.create({ data: productData });
  //   }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  //   findByName(name?: string){
  //     return this.prisma.product.findUnique({where: });
  //   }

  async findByName(name: string) {
    return this.prisma.product.findMany({
      where: {
        name: { contains: name },
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
