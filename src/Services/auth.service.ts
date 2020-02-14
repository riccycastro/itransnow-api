import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptProvider } from './Provider/bcrypt.provider';
import { User } from '../Entities/user.entity';
import { UserService } from './user.service';

@Injectable()
export class AuthService {

  private readonly usersService: UserService;
  private readonly jwtService: JwtService;
  private readonly bcryptProvider: BcryptProvider;

  constructor(
    usersService: UserService,
    jwtService: JwtService,
    bcryptProvider: BcryptProvider,
  ) {
    this.usersService = usersService;
    this.jwtService = jwtService;
    this.bcryptProvider = bcryptProvider;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByCredentials(username);
    if (user && await this.bcryptProvider.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
