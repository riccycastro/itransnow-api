import {Controller, Post, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from '../Services/auth.service';
import {ApiBody} from '@nestjs/swagger';
import {ControllerCore} from "../Core/Controllers/controller.core";

@Controller('auth')
export class AuthController extends ControllerCore {
  constructor(private readonly authService: AuthService) {
    super();
   }

  // @ApiBody({
  //   schema: {
  //     properties: {
  //       username: {
  //         type: 'string',
  //       },
  //       password: {
  //         type: 'string',
  //       },
  //     },
  //   },
  // })
  // @UseGuards(AuthGuard('local'))
  // @Post('login')
  // async loginAction(@Request() req) {
  //   return await this.authService.login(req.user);
  // }
}
