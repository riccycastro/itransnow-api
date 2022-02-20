import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../Auth/AuthGuard/jwt-auth.guard';
import { ControllerCore } from '../../../Core/Controller/controller.core';
import { Response } from 'express';
import { Application } from '../../Application/Entities/application.entity';
import UserInputDto from '../Dtos/user-input.dto';
import { GetUsersUseCase } from '../UseCase/GetUsersUseCase';
import { CreateUserUseCase } from '../UseCase/CreateUserUseCase';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('users')
export default class UserController extends ControllerCore {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {
    super();
  }

  @Get()
  async showListAction(@Res() res): Promise<string> {
    const [users, total] = await this.getUsersUseCase.run();
    return res.render('user/list', { users, total });
  }

  @Get('create')
  async showCreateAction(@Res() res, @Session() session: Record<string, any>) {
    return res.render('user/create', {
      errors: session.errors,
      application: session.data ?? new Application(),
    });
  }

  @Post('create')
  async createAction(
    @Body() userInputDto: UserInputDto,
    @Res() res: Response,
    @Req() req,
    @Session() session: Record<string, any>,
  ) {
    try {
      // const user = await this.createUserUseCase.run(
      //   new UserInputDto(userInputDto),
      //   req.user,
      // );
    } catch (err) {}
  }
}
