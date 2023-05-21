import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  async canActivate(ctx: ExecutionContext): Promise<any> {
    const request = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      // Add customerId property to the request object
      request.customerId = payload.customerId;
      request.email = payload.email;
      console.log('i am payload email', request.email)
      request.role = payload.role;
    //   request.createdByCustomerId= payload.createdByCustomerId
    //   request.createdByRole= payload.createdByRole

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers['authorization'];

    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }

    const [type, token] = authorization.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
