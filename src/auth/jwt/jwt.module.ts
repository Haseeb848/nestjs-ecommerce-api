import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
// import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './jwt.constant';
// import { AuthService } from './auth.service';
// import { jwtConstants } from './jwt.constant';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [ AuthService],
  exports: [AuthService],
})
export class AuthModule {}
