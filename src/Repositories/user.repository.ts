import { User } from '../Entities/user.entity';
import { EntityRepository } from 'typeorm';
import { AbstractRepository, QueryPaginationInterface } from './abstract.repository';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  async findUserByCredentials(credential: string): Promise<User | undefined> {
    return await this.findOne({
      where: [{ username: credential }, { email: credential }],
    });
  }

  async findInList(
    companyId: number,
    query: QueryPaginationInterface,
  ): Promise<[User[], number]> {
    let queryBuilder = this.createQueryBuilder('users')
      .innerJoin('users.company', 'company')
      .where('company.id = :companyId', { companyId })
      .andWhere('company.deletedAt = 0')
      .andWhere('users.isVisible = 1')
      .andWhere('users.deletedAt = 0');

    queryBuilder = this.queryName(queryBuilder, 'users', query);
    queryBuilder = this.queryUsername(queryBuilder, 'users', query);
    queryBuilder = this.queryEmail(queryBuilder, 'users', query);
    queryBuilder = this.queryActive(queryBuilder, 'users', query);
    queryBuilder = this.queryAdmin(queryBuilder, 'users', query);

    return await this.setPagination(
      queryBuilder,
      query,
      'users',
    ).getManyAndCount();
  }
}
