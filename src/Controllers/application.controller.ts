import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor, Delete,
} from '@nestjs/common';
import { ApplicationService } from '../Services/application.service';
import { CreateApplicationDto } from '../Dto/ApplicationDto';
import { AuthGuard } from '@nestjs/passport';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('applications')
export class ApplicationController {
  private readonly applicationService: ApplicationService;

  constructor(
    applicationService: ApplicationService,
  ) {
    this.applicationService = applicationService;
  }

  @Get(':alias')
  async getApplicationAction(@Request() req, @Param('alias') alias) {
    return await this.applicationService.findByAlias(req.user.company.id, alias, req.query);
  }

  @Get()
  async getApplicationsAction(@Request() req) {
    return await this.applicationService.findInList(req.user.company.id, req.query);
  }

  @Post()
  async createApplicationAction(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    await this.applicationService.create(createApplicationDto, req.user.company);
  }

  @Delete(':alias')
  async deleteApplicationAction(@Request() req, @Param('alias') alias) {
    await this.applicationService.delete(req.user, req.user.company.id, alias);
  }
}
