import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      customerId: request.customerId,
      email: request.email,
      role: request.role,
    };
  },
);



   //   createdByCustomerId: request.createdByCustomerId,
    //   createdByRole: request.createdByRole,