import {Controller, Get, Post, Req, Request, Res, UseGuards} from '@nestjs/common';
import {ApiBody} from '@nestjs/swagger';
import {ControllerCore} from "../../../../Core/Controllers/controller.core";
import {AuthService} from "../../Application/Services/auth.service";
import {Response} from "express";
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthGuard} from "../../Application/AuthGuard/jwt-auth.guard";
import {TOKEN_KEY} from "../../../../Core/Extractor/cookie.extractor";

@Controller('auth')
export class AuthController extends ControllerCore {
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Get('login')
    async showLoginPage(@Request() req, @Res() res: Response) {
        if (req.user) {
            res.redirect('/auth/profile')
        }

        return res.render('auth/login');
    }

    @ApiBody({
        schema: {
            properties: {
                username: {
                    type: 'string',
                },
                password: {
                    type: 'string',
                },
            },
        },
    })
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async loginAction(@Req() req, @Res() response: Response) {
        const token = await this.authService.login(req.user);
        response.cookie(TOKEN_KEY, token.accessToken)
        response.redirect('/auth/profile')
    }

    @UseGuards(AuthGuard('jwt'))
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async showProfilePage(@Req() req, @Res() res: Response) {
        console.log('showProfilePage', req.cookies)
        return res.render('profile', {user: req.user});
    }

    @Get('logout')
    async logoutAction(@Res() res: Response) {
        res.cookie('token', '')
        res.redirect('/auth/login')
    }
}
