import { Injectable } from '@nestjs/common';
import ApplicationService from '../../Domain/Services/application.service';
import { ApplicationInputDto } from '../Dtos/application-input.dto';

@Injectable()
export default class ApplicationAdapter {
  constructor(private readonly applicationService: ApplicationService) {}

  async createApplication(applicationInputDto: ApplicationInputDto) {
    await this.applicationService.createApplication(applicationInputDto);
  }
}
