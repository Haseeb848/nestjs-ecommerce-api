import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './customer/recvr-customer.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
// import { RedisModule } from 'nestjs-redis';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // RedisModule.forRootAsync({
    //   useFactory: () => ({
    //     url: 'redis://127.0.0.1:6379',
    //   }),
    // }),

    UserModule,
    AuthModule,
    MailModule,
    PrismaModule,
    ProductModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
