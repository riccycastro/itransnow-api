import {AuthGuard} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {

    if (info?.constructor?.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        message: 'Token expired',
        redirectTo: '/logout'
      });
    } else if (!user) {
      throw new UnauthorizedException({

      })
    }

    return user;
  }
}
