import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
// import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt/jwt.constant';
// import { RedisAuthGuard } from 'src/redis-auth.guard';

@Module({
  //   imports: [AuthModule],
  imports: [
    // ...
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  providers: [CartService], //JwtStrategy
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
