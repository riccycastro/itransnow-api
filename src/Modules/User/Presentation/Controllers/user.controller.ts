import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../Auth/Application/AuthGuard/jwt-auth.guard';
import { ControllerCore } from '../../../../Core/Controller/controller.core';
import UserAdapter from '../../Application/Adapters/user.adapter';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('users')
export default class UserController extends ControllerCore {
  constructor(private readonly userAdapter: UserAdapter) {
    super();
  }

  @Get()
  async showListAction(): Promise<string> {
    const [users, total] = await this.userAdapter.getList();
    return this.render('user/list', { users, total });
  }
}
