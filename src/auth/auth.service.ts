import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/signup.dto';
import { AuthInDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as argon from 'argon2';
import { CartService } from 'src/cart/cart.service';
import { Roles } from './guard/roles.decorator';
// import { RedisService } from 'nestjs-redis';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private cartService: CartService, // private redisService: RedisService
  ) {}

  async login(dtoin: AuthInDto) {
    const { password, email } = dtoin;
    const customer = await this.validateCustomer(email);
    if (!customer) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const pwMatches = await argon.verify(customer.hash, password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    console.log('hiiiiiiii customerrrrrr',customer);
    return this.signtoken(customer.id, customer.email, customer.role); // Pass the customer.id as the first argument
  }
  // const redisClient = this.redisService.getClient();
  // await redisClient.del(`token:${customer.id}`);

  async signup(dto: AuthDto) {
    const { firstName, lastName, password, email, role } = dto;
    // const userinDto = await this.validateCustomer(email);
    // if (userinDto) {
    //   throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    // }
    const hash = await argon.hash(password);
    const createdCustomer = await this.prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        hash,
        role: role || 'customer',
      },
    });

    // Create new cart for the customer
    await this.cartService.createCartForCustomer(createdCustomer.id); // Pass the created customer id

    throw new HttpException('success', HttpStatus.OK);
  }

  async signtoken(userId, email, role) {
    const secret = this.config.get('JWT_SECRET');
    const info = { email, userId, customerId: userId, role };
    const token = await this.jwt.sign(info, {
      expiresIn: '50m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  //  const redisClient = this.redisService.getClient();
  //  await redisClient.set(`token:${userId}`, token, 'EX', 60 * 60);

  //   async signtoken(customerId: number, email: string) {
  //     const secret = this.config.get('JWT_SECRET');

  //     const payload = { customerId, email };

  //     const token = await this.jwt.sign(payload, {
  //       expiresIn: '60m',
  //       secret: secret,
  //     });

  //     return {
  //       access_token: token,
  //     };
  //   }

  //   async validateCustomer(email: string) {
  //     const user = await this.prisma.customer.findUnique({
  //       where: {
  //         email: email,
  //       },
  //     });

  //     return user;
  //   }

  async validateCustomer(email: string) {
    console.log('Email:', email); // Debug line

    if (!email) {
      throw new Error('Email is required to validate a customer.');
    }
    console.log('finding email');
    const user = await this.prisma.customer.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        hash: true,
        // Add other fields as necessary
        role: true,
      },
    });

    return user;
  }

  //   async validateCustomer(email: string, role: string): Promise<any> {
  //     const user = await this.prisma.customer.findUnique({
  //       where: {
  //         email: email,
  //       },
  //     });

  //     if (user) {
  //       const customer = await this.prisma.customer.findUnique({
  //         where: {
  //           email: email,
  //           firstName:
  //           role: role,
  //         },
  //       });

  //       if (customer) {
  //         return customer;
  //       }
  //     }

  //     return null;
  //   }

  //   async validateUser(email: string, role: string): Promise<any> {
  //     const user = await this.prisma.customer.findUnique({
  //       where: {
  //         email: email,
  //       },
  //     });

  //     if (user && user.role === role) {
  //       return user;
  //     }

  //     return null;
  //   }
}
