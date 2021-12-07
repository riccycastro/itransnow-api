import { User } from '../../Domain/Entities/user.entity';
import { RepositoryCore } from '../../../../Core/Repositories/repository.core';
import { Inject, Injectable } from '@nestjs/common';
import { TENANT_CONNECTION } from '../../../../Core/Tenant/tenant.module';
import { Repository } from 'typeorm';

@Injectable()
export default class UserRepository extends RepositoryCore<User> {
  private repository: Repository<User>;

  constructor(@Inject(TENANT_CONNECTION) private connection) {
    super();
    this.repository = connection.getRepository(User);
  }

  async findByCredentials(credential: string): Promise<User | undefined> {
    return this.repository.findOne({
      where: [{ username: credential }, { email: credential }],
    });
  }

  async findOne(id: string | number) {
    this.connection.getRepository(User);

    return await this.connection.getRepository(User).findOne(id);
  }
}
