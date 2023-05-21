import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { Roles } from 'src/auth/guard/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
// import { GetCustomer } from 'src/cart/decorator/get_customer.decorator';
import { GetUser } from './decorator/get_user.decorator';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Multer } from 'multer';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Roles('admin', 'admin5')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body({} as any) createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: any,
  ) {
    console.log('user--------', user);
    console.log(createProductDto, '0---=--');
    const price = parseFloat(createProductDto.price);

    // Check if the price is a valid number
    if (isNaN(price)) {
      throw new BadRequestException('Price must be a valid number');
    }

    return this.productService.createProduct(createProductDto, user, file);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Get('search/:name')
  async findByName(@Param('name') name: string) {
    return this.productService.findByName(name);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
