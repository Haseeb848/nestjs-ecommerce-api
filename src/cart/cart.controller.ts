import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Patch,
  ParseIntPipe,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
// import { User } from 'src/utilities/user.decorator';
import { error } from 'console';
import { request } from 'http';
// import { getCustomer } from 'src/auth/decorator/get_customer.decorator';
// import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { Headers } from 'node-fetch';
import { JwtService } from '@nestjs/jwt';
import { GetCustomer } from 'src/cart/decorator/get_customer.decorator';
// import { RedisAuthGuard } from 'src/redis-auth.guard';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCustomerCart(@Req() req: any) {
    const token = req.headers['authorization'].split(' ')[1];
    const customerId = this.jwtService.decode(token)['customerId'];
    console.log('authorized success get cart');
    return this.cartService.getCustomerCart(customerId);
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Post('add-product-by-name')
  //   async addProductByNameToCart(
  //     @User() user: any,
  //     @Body('productName') productName: string,
  //     @Body('customerId') customerId: number,
  //     @Body('quantity') quantity: number,
  //     @Req() request:any
  //   ) {
  //     console.log('authorized success');

  //     return this.cartService.addProductByNameToCustomerCart(
  //       customerId,
  //       productName,
  //       quantity,
  //     //   request.customerId,
  //       parseInt(request.customerId, 10)
  //     );
  //   }
  @UseGuards(JwtAuthGuard)
  @Post('add-product-by-name')
  async addProductByNameToCart(
    // @User('userId') customerId: number,
    @GetCustomer() customer: any, //decorator is used in it
    @Body('productName') productName: string,
    @Body('quantity') quantity: number,
  ) {
    console.log(`Customer ID: ${customer.userId}`);
    return this.cartService.addProductByNameToCustomerCart(
      customer.userId,
      productName,
      quantity,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add-product-quantity-by-name')
  async addQuantityByNameToCart(
    // @User('userId') customerId: number,
    @GetCustomer() customer: any, //decorator is used in it
    @Body('productName') productName: string,
    @Body('quantity') quantity: number,
  ) {
    console.log(`Customer ID: ${customer.userId}`);
    return this.cartService.addProductByNameToCustomerCart(
      customer.userId,
      productName,
      quantity,
    );
  }

  // @UseGuards(JwtAuthGuard)
  //   @Delete(':customerId/:productId/:productName')
  //   async removeItemFromCustomerCart(
  //     @Param('customerId') customerId: string,
  //     @Param('productId') productId: string,
  //     @Param ('productName') productName: string,
  //   ) {
  //     return this.cartService.removeItemFromCustomerCart(
  //       parseInt(customerId, 10),
  //       parseInt(productId, 10),

  //     );
  //   }
  @UseGuards(JwtAuthGuard)
  @Delete(':productId?/:productName?')
  async removeItemFromCustomerCart(
    // @Param('customerId', ParseIntPipe) customerId: number,
    @GetCustomer() customer: any,
    @Param('productId', ParseIntPipe) productId?: number,
    @Param('productName') productName?: string,
  ) {
    return this.cartService.removeItemFromCustomerCart(
      customer.userId,
      productId,
      productName,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove-product-quantity')
  removeProductQuantityFromCustomerCart(
    @GetCustomer() customer: any,
    @Body('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    console.log(
      this.removeItemFromCustomerCart,
      `product remove by cust id ${productId}`,
    );
    console.log(`Customer ID for quantity: ${customer.userId}`);
    return this.cartService.removeProductQuantityFromCustomerCart(
      customer.userId,
      productId,
      quantity,
    );
  }

  //   @Post()
  //   create(@Body() createCartDto: CreateCartDto) {
  //     return this.cartService.create(createCartDto);
  //   }

  //   @Get()
  //   findAll() {
  //     return this.cartService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.cartService.findOne(+id);
  //   }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
