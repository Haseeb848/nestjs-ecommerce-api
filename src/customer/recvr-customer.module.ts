import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { MailService } from 'src/mail/mail.service';
import { MailController } from 'src/mail/mail.controller';
import { CustomerService } from './recvr-customer.service';
import { CustomerController } from './recvr-customer.controller';
import { PrismaService } from 'src/prisma.service';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    CartModule,
  ],
  providers: [CustomerService, AuthService, MailService],
  controllers: [CustomerController, MailController],
})
export class UserModule {}
