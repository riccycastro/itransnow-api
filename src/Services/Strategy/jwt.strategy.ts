import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company.service';
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly companyService: CompanyService;
  private readonly userService: UserService;

  constructor(
    companyService: CompanyService,
    userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
    this.companyService = companyService;
    this.userService = userService;
  }

  async validate(payload: any) {

    const user = await this.userService.findById(payload.sub);
    await user.company;

    //todo@rcastro - validate if company is active/not deleted
    //               validate if user is active/not deleted

    return user;
  }
}
