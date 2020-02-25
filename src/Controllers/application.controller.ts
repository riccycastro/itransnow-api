import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor, Delete, Patch,
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

  @Get(':alias')
  async getApplicationAction(@Request() req, @Param('alias') alias) {
    return await this.applicationService.findByAlias((await req.user.company).id, alias, req.query);
  }

  @Get()
  async getApplicationsAction(@Request() req) {
    return await this.applicationService.findInList((await req.user.company).id, req.query);
  }

  @Post()
  async createApplicationAction(@Body() createApplicationDto: ApplicationDto, @Request() req) {
    await this.applicationService.save(
      await this.applicationService.create(createApplicationDto, req.user.company),
    );
  }

  @Delete(':alias')
  async deleteApplicationAction(@Request() req, @Param('alias') alias) {
    await this.applicationService.delete(
      await this.applicationService.findByAlias((await req.user.company).id, alias),
    );
  }

  @Patch(':alias')
  async updateApplicationAction(@Request() req, @Body() updateApplicationDto: ApplicationDto, @Param('alias') alias) {
    await this.applicationService.update(
      await this.applicationService.findByAlias((await req.user.company).id, alias),
      updateApplicationDto
    );
  }
}
