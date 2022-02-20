import DomainRepositoryInterface from '../../../Core/Interfaces/domain.repository.interface';
import { Application } from '../Entities/application.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetApplicationsUserCase {
  constructor(
    @Inject('ApplicationRepositoryInterface')
    private readonly applicationRepository: DomainRepositoryInterface<Application>,
  ) {}

  async run(): Promise<[Application[], number]> {
    return this.applicationRepository.findAndCount();
  }
}
