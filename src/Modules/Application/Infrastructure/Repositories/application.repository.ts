import { RepositoryCore } from '../../../../Core/Repositories/repository.core';
import { Application } from '../../Domain/Entities/application.entity';
import { Inject } from '@nestjs/common';
import { TENANT_CONNECTION } from '../../../../Core/Tenant/tenant.module';
import { Connection, SaveOptions } from 'typeorm';
import { ApplicationRepositoryInterface } from '../../Domain/Interfaces/application.repository.interface';
import { DeepPartial } from 'typeorm/common/DeepPartial';

export default class ApplicationRepository
  extends RepositoryCore<Application>
  implements ApplicationRepositoryInterface
{
  constructor(@Inject(TENANT_CONNECTION) private connection: Connection) {
    super(connection.getRepository(Application));
  }

  save<T extends DeepPartial<Application>>(
    entity: T[] | T,
    options?: SaveOptions,
  ): Promise<T & Application> | Promise<T[]> | Promise<(T & Application)[]> {
    return super.save(entity, options);
  }

  findOneByAlias(alias?: string): Promise<Application | undefined> {
    return this.repository.findOne({ where: { alias: alias } });
  }
}
