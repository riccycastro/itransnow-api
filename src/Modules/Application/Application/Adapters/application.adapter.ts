import { Inject, Injectable } from '@nestjs/common';
import ApplicationService from '../../Domain/Services/application.service';
import { ApplicationInputDto } from '../Dtos/application-input.dto';
import { Application } from '../../Domain/Entities/application.entity';
import { User } from '../../Domain/Entities/user.entity';
import DomainRepositoryInterface from '../../../../Core/Interfaces/domain.repository.interface';

@Injectable()
export default class ApplicationAdapter {
  constructor(
    @Inject('ApplicationRepositoryInterface')
    private readonly applicationRepository: DomainRepositoryInterface<Application>,
    private readonly applicationService: ApplicationService,
  ) {}

  async getList(): Promise<[Application[], number]> {
    return this.applicationRepository.findAndCount();
  }

  async createApplication(
    applicationInputDto: ApplicationInputDto,
    createdBy: User,
  ): Promise<Application> {
    return this.applicationService.createApplication(
      applicationInputDto,
      createdBy,
    );
  }
}
