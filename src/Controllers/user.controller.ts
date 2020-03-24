import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {

  @ApiBearerAuth()
  @Get('profile')
  profileAction(@Request() req) {
    return req.user;
  }
}
