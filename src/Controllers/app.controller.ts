import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from '../Dto/register-user.dto';
import { UserService } from '../Services/user.service';

@Controller()
export class AppController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post('register')
  async registerAction(@Body() registerUserDto: RegisterUserDto) {
    await this.userService.register(registerUserDto);
  }
}
