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
import { JwtAuthGuard } from '../../../Auth/Application/AuthGuard/jwt-auth.guard';
import { Response } from 'express';
import ApplicationAdapter from '../../Application/Adapters/application.adapter';
import { ApplicationInputDto } from '../../Application/Dtos/application-input.dto';
import { ControllerCore } from '../../../../Core/Controller/controller.core';
import { ApplicationAliasExistsException } from '../../Domain/Exceptions/application-alias-exists.exception';
import { Application } from '../../Domain/Entities/application.entity';
import { RoutesDefinition } from '../../../../Core/View/routes-definition';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationController extends ControllerCore {
  constructor(private readonly applicationAdapter: ApplicationAdapter) {
    super();
  }

  @Get()
  async showListAction() {
    const [applications, total] = await this.applicationAdapter.getList();
    return this.render('application/list', { applications, total });
  }

  @Get('create')
  async showCreateAction(@Session() session: Record<string, any>) {
    return this.render('application/create', {
      errors: session.errors,
      application: session.data ?? new Application(),
    });
  }

  @Post('create')
  async createAction(
    @Body() applicationInputDto: ApplicationInputDto,
    @Res() res: Response,
    @Req() req,
    @Session() session: Record<string, any>,
  ) {
    applicationInputDto = new ApplicationInputDto(applicationInputDto);
    const errors = await this.validate(applicationInputDto);

    if (errors.length) {
      this.flashErrorNotification(
        'Failed to create application',
        session,
        errors,
      );
      res.redirect(RoutesDefinition.url('application_create'));
      return;
    }

    try {
      const application = await this.applicationAdapter.createApplication(
        applicationInputDto,
        req.user,
      );
      this.flashSuccessNotification(
        `Application ${application.name} created`,
        session,
      );
      res.redirect(RoutesDefinition.url('application_list'));
    } catch (err) {
      let errMessage = 'Failed to create application';
      if (err instanceof ApplicationAliasExistsException) {
        errMessage = err.message;
      }

      this.flashErrorNotification(
        errMessage,
        session,
        undefined,
        applicationInputDto,
      );

      res.redirect(RoutesDefinition.url('application_create'));
    }
  }
}
