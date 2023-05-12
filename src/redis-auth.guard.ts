// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guard/auth.guard'; // Make sure to import the correct path
// import { RedisService } from 'nestjs-redis';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class RedisAuthGuard extends JwtAuthGuard implements CanActivate {
//   constructor(
//     private readonly redisService: RedisService,
//     jwtService: JwtService,
//     config: ConfigService,
//   ) {
//     super(jwtService, config);
//   }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const canActivate = (await super.canActivate(context)) as boolean;
//     if (!canActivate) return false;

//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     const token = request.headers['authorization'].split(' ')[1];

//     // Check if token is in Redis
//     const redisClient = this.redisService.getClient();
//     const storedToken = await redisClient.get(`token:${user.userId}`);

//     return storedToken === token;
//   }
// }
