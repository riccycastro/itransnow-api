import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../../Application/Services/auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../Application/AuthGuard/jwt-auth.guard';
import { TOKEN_KEY } from '../../../../Core/Extractor/cookie.extractor';
import { ControllerCore } from '../../../../Core/Controller/controller.core';
import { RoutesDefinition } from '../../../../Core/View/routes-definition';

@Controller('auth')
export class AuthController extends ControllerCore {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Get('login')
  async showLoginPage() {
    return this.render('auth/login');
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginAction(@Req() req, @Res() response: Response) {
    const token = await this.authService.login(req.user);
    response.cookie(TOKEN_KEY, token.accessToken);
    response.redirect(RoutesDefinition.url('application_list'));
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async showProfilePage(@Req() req) {
    return this.render('profile', { user: req.user });
  }

  @Get('logout')
  async logoutAction(@Res() res: Response) {
    res.cookie('token', '');
    res.redirect(RoutesDefinition.url('auth_login'));
  }
}
