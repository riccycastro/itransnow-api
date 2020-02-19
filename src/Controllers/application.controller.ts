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
import { CreateApplicationDto } from '../Dto/CreateApplicationDto';
import { AuthGuard } from '@nestjs/passport';

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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getApplication(@Request() req, @Param('id') id) {
    return await this.applicationService.findById(req.user.company, id);
  }

  @Post()
  async createApplicationAction(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    await this.applicationService.create(createApplicationDto, req.user.company);
  }
}
