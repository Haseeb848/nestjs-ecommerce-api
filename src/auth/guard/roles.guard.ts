import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('role', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log('request.user:', roles);
    const user = await this.authService.validateCustomer(request.email)
    console.log('i am role', roles)

    // request.customerId = user;
    const resolvedCustomer = await user;
    const hasRole = roles.some((role) => role === resolvedCustomer.role);
    if (!user || !hasRole){
        throw new ForbiddenException('You do not have access to this resource')

    }
    console.log(' i am resolvedCust:', resolvedCustomer)
    console.log('jjjjjj', roles)
    return resolvedCustomer && hasRole;
  }
}
