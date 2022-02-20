import { RepositoryCore } from '../../../Core/Repositories/repository.core';
import { Application } from '../Entities/application.entity';
import { Inject } from '@nestjs/common';
import { TENANT_CONNECTION } from '../../../Core/Tenant/tenant.module';
import { Connection } from 'typeorm';
import DomainRepositoryInterface from '../../../Core/Interfaces/domain.repository.interface';

export default class ApplicationRepository
  extends RepositoryCore<Application>
  implements DomainRepositoryInterface<Application>
{
  constructor(@Inject(TENANT_CONNECTION) private connection: Connection) {
    super(connection.getRepository(Application));
  }

  findList(): Promise<[Application[], number]> {
    return this.repository.findAndCount();
  }
}
