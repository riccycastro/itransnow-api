import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly companyService: CompanyService;

  constructor(companyService: CompanyService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
    this.companyService = companyService;
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      isAdmin: payload.isAdmin,
      company: await this.companyService.findById(payload.companyId),
    };
  }
}
