import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { validateOrReject, ValidationError } from 'class-validator';
import { JwtAuthGuard } from '../../Auth/AuthGuard/jwt-auth.guard';
import { Response } from 'express';
import { ApplicationInputDto } from '../Dtos/application-input.dto';
import { ControllerCore } from '../../../Core/Controller/controller.core';
import { ApplicationAliasExistsException } from '../Exceptions/application-alias-exists.exception';
import { Application } from '../Entities/application.entity';
import { RoutesDefinition } from '../../../Core/View/routes-definition';
import { GetApplicationsUserCase } from '../UseCase/GetApplicationsUserCase';
import { CreateApplicationUseCase } from '../UseCase/CreateApplicationUseCase';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationController extends ControllerCore {
  constructor(
    private readonly createApplicationUseCase: CreateApplicationUseCase,
    private readonly getApplicationsUseCase: GetApplicationsUserCase,
  ) {
    super();
  }

  @Get()
  async showListAction(@Res() res: Response) {
    const [applications, total] = await this.getApplicationsUseCase.run();
    res.render('application/list', { applications, total });
  }

  @Get('create')
  async showCreateAction(@Req() req, @Res() res: Response) {
    const flashData = req.flash('data');
    let data = null;

    if (flashData.length) {
      data = flashData[0];
    }

    res.render('application/create', {
      application: data ?? new Application(),
    });
  }

  @Post('create')
  async createAction(@Body() applicationInputDto, @Res() res, @Req() req) {
    try {
      applicationInputDto = new ApplicationInputDto(applicationInputDto);
      await validateOrReject(applicationInputDto);

      const application = await this.createApplicationUseCase.run(
        applicationInputDto,
        req.user,
      );
      this.flashSuccessNotification(
        `Application ${application.name} created`,
        req,
      );
      res.redirect(RoutesDefinition.url('application_list'));
    } catch (err) {
      let errMessage = 'Failed to create application';
      let errors = undefined;

      if (err instanceof ApplicationAliasExistsException) {
        errMessage = err.message;
      } else if (Array.isArray(err) && err[0] instanceof ValidationError) {
        errors = await this.HandleValidationErrors(err);
      }

      this.flashErrorNotification(errMessage, req, errors, applicationInputDto);

      res.redirect(RoutesDefinition.url('application_create'));
    }
  }
}
