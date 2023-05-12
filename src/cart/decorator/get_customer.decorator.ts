// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const GetCustomer = createParamDecorator(

//   (data: string, ctx: ExecutionContext) => {
//    const request = ctx.switchToHttp().getRequest();
// //    const customer = request.customer;
//    return request.user //data ? customer?.[data] : customer;

//   },

// );

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../../auth/jwt/jwt.constant';

export const GetCustomer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log('i am get_custmore decorator');
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return null;
    }

    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret); //jwt constant
      return decodedToken;
    } catch (error) {
      return null;
    }
  },
);
