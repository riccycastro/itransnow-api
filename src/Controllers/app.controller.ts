import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from '../Services/Dto/RegisterUserDto';
import { UserService } from '../Services/user.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {
  }

  @Post('register')
  async registerAction(@Body() registerUserDto: RegisterUserDto) {
    await this.userService.register(registerUserDto);
  }
}
