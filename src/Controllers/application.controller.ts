import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApplicationService } from '../Services/application.service';
import { ApplicationDto } from '../Dto/ApplicationDto';
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

  @Get()
  async getApplicationsAction(@Request() req) {
    return await this.applicationService.findInList(req.user.company, req.query);
  }

  @Get(':alias')
  async getApplication(@Request() req, @Param('alias') alias) {
    return await this.applicationService.findById(req.user.company.id, alias);
  }

  @Post()
  async createApplicationAction(@Body() createApplicationDto: ApplicationDto, @Request() req) {
    await this.applicationService.create(createApplicationDto, req.user.company);
  }
}
