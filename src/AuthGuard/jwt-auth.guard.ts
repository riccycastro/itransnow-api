import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (!user || info?.constructor?.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        message: 'Token expired',
        redirectTo: '/logout'
      });
    }

    return user;
  }
}
