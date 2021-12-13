import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
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
import { EdgeProvider } from '../../../../Core/View/edge.provider';
import { ApplicationAliasExistsException } from '../../Domain/Exceptions/application-alias-exists.exception';
import { Application } from '../../Domain/Entities/application.entity';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationController extends ControllerCore {
  constructor(
    edgeProvider: EdgeProvider,
    private readonly applicationAdapter: ApplicationAdapter,
  ) {
    super(edgeProvider);
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
      res.redirect('/applications/create');
      return;
    }

    try {
      await this.applicationAdapter.createApplication(applicationInputDto);
      this.flashSuccessNotification('Application created', session);
      res.redirect('/applications/create'); // todo@rcastro: should redirect to application list
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

      res.redirect('/applications/create');
    }
  }
}
