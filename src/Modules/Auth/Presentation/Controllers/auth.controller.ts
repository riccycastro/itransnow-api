import {
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../Application/Services/auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../../Application/AuthGuard/jwt-auth.guard';
import { TOKEN_KEY } from '../../../../Core/Extractor/cookie.extractor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  async showLoginPage(@Request() req, @Res() res: Response) {
    return res.render('auth/login');
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginAction(@Req() req, @Res() response: Response) {
    const token = await this.authService.login(req.user);
    response.cookie(TOKEN_KEY, token.accessToken);
    response.redirect('/auth/profile');
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async showProfilePage(@Req() req, @Res() res: Response) {
    return res.render('profile', { user: req.user });
  }

  @Get('logout')
  async logoutAction(@Res() res: Response) {
    res.cookie('token', '');
    res.redirect('/auth/login');
  }
}
