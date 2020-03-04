import { EntityRepository } from 'typeorm';
import { Application } from '../Entities/application.entity';
import { AbstractRepository, QueryPaginationInterface } from './abstract.repository';

@EntityRepository(Application)
export class ApplicationRepository extends AbstractRepository<Application> {

  async findInList(companyId: number, query: QueryPaginationInterface): Promise<Application[]> {
    let queryBuilder = this.createQueryBuilder('applications')
      .innerJoin('applications.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('applications.isDeleted = \'0\'');

    queryBuilder = this.queryName(queryBuilder, 'applications', query.search);
    queryBuilder = this.queryAlias(queryBuilder, 'applications', query.search);
    queryBuilder = this.queryActive(queryBuilder, 'applications', query.search);

    return await this.setPagination(queryBuilder, query, 'applications').getMany();
  }
}
