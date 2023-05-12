import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guard/auth.guard';
import { PrismaService } from 'src/prisma.service';
import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';
import { CartService } from 'src/cart/cart.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),CartModule
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtAuthGuard, CartService],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
