import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApplicationService } from '../Services/application.service';
import { CreateApplicationDto } from '../Services/Dto/CreateApplicationDto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('applications')
export class ApplicationController {
  private readonly applicationService: ApplicationService;

  constructor(applicationService: ApplicationService) {
    this.applicationService = applicationService;
  }

  @Post()
  async createAction(@Body() createApplicationDto: CreateApplicationDto) {
    await this.applicationService.create(createApplicationDto);
  }
}
