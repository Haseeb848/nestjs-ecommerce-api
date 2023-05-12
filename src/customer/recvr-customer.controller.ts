import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
// import { getCustomer } from 'src/auth/decorator/get_customer.decorator';
import { Customer } from '@prisma/client';
import { ChangeInDto } from 'src/auth/dto/login.dto';
import { EditUserDto } from 'src/auth/dto/login.dto';
import { EmailDto } from 'src/auth/dto/signup.dto';
import { Request } from 'express';
import { parse } from 'querystring';
import { CustomerService } from './recvr-customer.service';
import { User } from 'src/utilities/user.decorator';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Patch('recover')
  recover(@Body('email') email: EmailDto, @Req() req: Request) {
    const hosts = req.headers.host;

    return this.customerService.recover(email, hosts);
  }

  @Get('reset/:token')
  getReset() {
    return this.customerService.getReset();
  }

  @Patch('reset/:token')
  reset(@Param('token') token: string, @Body() passwordDto: ChangeInDto) {
    console.log(token, 'passwordreset');
    return this.customerService.reset(passwordDto, token);
  }

  @Patch('change/password')
  @UseGuards(JwtAuthGuard)
  changPassword(
    @Body() passwordDto: ChangeInDto,
    @User('email') email: string, //getCustomer replaced with user
  ) {
    return this.customerService.changPassword(email, passwordDto);
  }

  @Patch('change/detail')
  @UseGuards(JwtAuthGuard)
  updateInfo(@Body() info: EditUserDto, @User('email') email: string) {
    //getCustomer replaced with User
    return this.customerService.updateInfo(email, info);
  }
}
