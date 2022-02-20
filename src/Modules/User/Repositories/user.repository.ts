import { RepositoryCore } from '../../../Core/Repositories/repository.core';
import User from '../Entities/user.entity';
import { Inject } from '@nestjs/common';
import { TENANT_CONNECTION } from '../../../Core/Tenant/tenant.module';
import { Connection } from 'typeorm';
import DomainRepositoryInterface from '../../../Core/Interfaces/domain.repository.interface';

export default class UserRepository
  extends RepositoryCore<User>
  implements DomainRepositoryInterface<User>
{
  constructor(@Inject(TENANT_CONNECTION) private connection: Connection) {
    super(connection.getRepository(User));
  }
}
