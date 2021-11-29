import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {UserRepository} from "../../Infrastructure/Repositories/user.repository";
import {fromCookie} from "../../../../Core/Extractor/cookie.extractor";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: fromCookie(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne(payload.sub);
    ExtractJwt.fromAuthHeaderAsBearerToken();
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
