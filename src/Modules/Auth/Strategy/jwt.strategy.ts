import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { fromCookie } from '../../../Core/Extractor/cookie.extractor';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import UserRepository from '../Repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      jwtFromRequest: fromCookie(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const contextId = ContextIdFactory.create();
    this.moduleRef.registerRequestByContextId(request, contextId);

    const userRepository = await this.moduleRef.resolve<UserRepository>(
      UserRepository,
      contextId,
    );

    const user = await userRepository.findOne(payload.sub);

    if (user.deletedAt) {
      throw new NotFoundException();
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        "You don't have access... please contact your system admin",
      );
    }

    return user;
  }
}
