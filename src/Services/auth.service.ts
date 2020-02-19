import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptProvider } from './Provider/bcrypt.provider';
import { User } from '../Entities/user.entity';
import { UserService } from './user.service';
import { CompanyService } from './company.service';

@Injectable()
export class AuthService {

  private readonly usersService: UserService;
  private readonly jwtService: JwtService;
  private readonly bcryptProvider: BcryptProvider;
  private readonly companyService: CompanyService;

  constructor(
    usersService: UserService,
    jwtService: JwtService,
    bcryptProvider: BcryptProvider,
    companyService: CompanyService,
  ) {
    this.usersService = usersService;
    this.jwtService = jwtService;
    this.bcryptProvider = bcryptProvider;
    this.companyService = companyService;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByCredentials(username);
    if (user && await this.bcryptProvider.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const company = await user.company;

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      companyId: company.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
