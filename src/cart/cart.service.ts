import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  create(createCartDto: CreateCartDto) {
    return this.prisma.cart.create({ data: createCartDto });
  }

  async createCartForCustomer(customerId: number) {
    const newCart = await this.prisma.cart.create({
      data: {
        customerId,
        totalPrice: 0,
      },
    });

    console.log(
      'New cart created for customer ID:',
      customerId,
      'Cart:',
      newCart,
    ); // Log the cart creation

    return newCart;
  }

  async addProductByNameToCustomerCart(
    customerId: number,
    productName: string,
    quantity: number,
  ) {
    console.log(`Customer ID in CartService: ${customerId}`);
    // Find the product by name
    const product = await this.prisma.product.findFirst({
      where: { name: productName },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Get the customer's cart
    const cart = await this.getCustomerCart(customerId);

    // Check if the product already exists in the cart
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });

    if (existingCartItem) {
      // Update the quantity of the existing cart item
      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Add the product to the cart as a new cart item
      await this.prisma.cartItem.create({
        data: {
          productId: product.id,
          cartId: cart.id,
          quantity: quantity,
        },
      });
    }

    // Update the cart's total price
    const updatedTotalPrice = await this.calculateTotalPrice(cart.id);
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { totalPrice: updatedTotalPrice },
    });

    // Return the updated cart
    return this.getCustomerCart(customerId);
  }

  async removeProductQuantityFromCustomerCart(
    customerId: number,
    productId: number,
    quantity: number,
  ) {
    // Find the product by id
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Get the customer's cart
    const cart = await this.getCustomerCart(customerId);

    // Find the cart item for the specified product
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Calculate the new quantity
    const newQuantity = Math.max(cartItem.quantity - quantity, 0);

    // Update the cart item's quantity
    await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: newQuantity },
    });

    // Update the cart's total price
    const updatedTotalPrice = await this.calculateTotalPrice(cart.id);
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { totalPrice: updatedTotalPrice },
    });

    // Remove the cart item if the new quantity is 0
    if (newQuantity === 0) {
      await this.prisma.cartItem.delete({ where: { id: cartItem.id } });
    }

    // Return the updated cart
    return this.getCustomerCart(customerId);
  }

  private async calculateTotalPrice(cartId: number): Promise<number> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId },
      include: { product: true },
    });

    const totalPrice = cartItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    return totalPrice;
  }

  //   async getCustomerCart(customerId: number) {
  //     return this.prisma.cart.findFirst({
  //       where: { customer: { id: customerId } },
  //       include: { items: { include: { product: true } } },
  //     });
  //   }
  //   async getCustomerCart(customerId: number) {
  //     return this.prisma.cart.findFirst({
  //       where: { customer: { id: { equals: customerId } } },
  //       include: { items: { include: { product: true } } },
  //     });
  //   }
  async getCustomerCart(customerId: number) {
    return this.prisma.cart.findFirst({
      where: { customerId: customerId },
      include: { items: { include: { product: true } } },
    });
  }

  //   async removeItemFromCustomerCart(customerId: number, productId: number) {
  //     // Get the customer's cart
  //     const cart = await this.getCustomerCart(customerId);

  //     // Find the cart item to remove
  //     const cartItem = await this.prisma.cartItem.findFirst({
  //       where: {
  //         cartId: cart.id,
  //         productId: productId,
  //       },
  //     });

  //     if (!cartItem) {
  //       throw new NotFoundException('Cart item not found');
  //     }

  //     // Update the cart's total price
  //     const product = await this.prisma.product.findUnique({
  //       where: { id: productId },
  //     });
  //     const updatedTotalPrice =
  //       cart.totalPrice - product.price * cartItem.quantity;
  //     await this.prisma.cart.update({
  //       where: { id: cart.id },
  //       data: { totalPrice: updatedTotalPrice },
  //     });

  //     // Remove the cart item
  //     return this.prisma.cartItem.delete({
  //       where: {
  //         id: cartItem.id,
  //       },
  //     });
  //   }

  async removeItemFromCustomerCart(
    customerId: number,
    productId?: number,
    productName?: string,
  ) {
    // Get the customer's cart
    const cart = await this.getCustomerCart(customerId);

    let product;

    if (productId) {
      // Find the product by productId
      product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
    } else if (productName) {
      // Find the product by productName
      product = await this.prisma.product.findFirst({
        where: { name: productName },
      });
    } else {
      throw new BadRequestException(
        'Either productId or productName must be provided',
      );
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Find the cart item for the specified product
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Update the cart's total price
    const updatedTotalPrice =
      cart.totalPrice - cartItem.quantity * product.price;

    // Delete the cart item
    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    // Update the cart with the new total price
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { totalPrice: updatedTotalPrice },
    });

    // Return the updated cart
    return this.getCustomerCart(customerId);
  }

  findAll() {
    return this.prisma.cart.findMany();
  }

  findOne(id: number) {
    return this.prisma.cart.findUnique({ where: { id } });
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return this.prisma.cart.update({ where: { id }, data: updateCartDto });
  }

  remove(id: number) {
    return this.prisma.cart.delete({ where: { id } });
  }
}
