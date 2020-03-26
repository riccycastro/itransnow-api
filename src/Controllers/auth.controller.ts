import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../Services/auth.service';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  
  @ApiBody({
    schema: {
      properties: {
        username: {
          type: "string"
        },
        password: {
          type: "string"
        }
      },
    },
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginAction(@Request() req) {
    return await this.authService.login(req.user);
  }
}
