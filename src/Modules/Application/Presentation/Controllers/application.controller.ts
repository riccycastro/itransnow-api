import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../Auth/Application/AuthGuard/jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('applications')
export class ApplicationController {
  @UseGuards(JwtAuthGuard)
  @Get('create')
  async showCreateAction(@Res() res: Response, @Req() req: Request) {
    return res.render('application/create');
  }
}
