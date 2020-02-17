import { Body, Controller, Post, UseGuards, Request, Get, Param } from '@nestjs/common';
import { ApplicationService } from '../Services/application.service';
import { CreateApplicationDto } from '../Dto/CreateApplicationDto';
import { AuthGuard } from '@nestjs/passport';
import { GetApplicationsConverter } from '../Services/DtoConverters/GetApplicationsConverter';

@UseGuards(AuthGuard('jwt'))
@Controller('applications')
export class ApplicationController {
  private readonly applicationService: ApplicationService;
  private readonly getApplicationsConverter: GetApplicationsConverter;

  constructor(
    applicationService: ApplicationService,
    getApplicationsConverter: GetApplicationsConverter
  ) {
    this.applicationService = applicationService;
    this.getApplicationsConverter = getApplicationsConverter;
  }

  @Get()
  async getApplicationsAction(@Request() req) {
    return this.getApplicationsConverter.convertToDtoList(
      await this.applicationService.findInList(req.user.company, req.query)
    );
  }

  @Get(':id')
  async getApplication(@Param('id') id) {
    return 
  }

  @Post()
  async createAction(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    await this.applicationService.create(createApplicationDto, req.user.company);
  }
}
