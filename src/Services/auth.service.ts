import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptProvider } from './Provider/bcrypt.provider';
import { User } from '../Entities/user.entity';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    // private readonly jwtService: JwtService,
    private readonly bcryptProvider: BcryptProvider,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByCredentials(username);
    if (user && (await this.bcryptProvider.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      companyId: user.companyId,
    };

    return {
      accessToken: {},
    };
  }
}
