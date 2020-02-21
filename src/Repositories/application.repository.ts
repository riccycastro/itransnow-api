import { EntityRepository } from 'typeorm';
import { Application } from '../Entities/application.entity';
import { AbstractRepository, QueryPaginationInterface } from './abstract.repository';

@EntityRepository(Application)
export class ApplicationRepository extends AbstractRepository<Application> {

  async findByCompany(companyId: number, query: QueryPaginationInterface): Promise<Application[]> {

    /**
     * sta da erro pamo kel jwt strategy
     */
    console.log(companyId);

    const queryBuilder = this.createQueryBuilder('applications')
      .innerJoin('applications.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('applications.isDeleted = \'0\'');

    if (query.search.name) {
      queryBuilder
        .andWhere('applications.name LIKE :name', { name: '%' + query.search.name + '%' });
    }

    if (query.search.alias) {
      queryBuilder
        .andWhere('applications.name LIKE :alias', { alias: '%' + query.search.alias + '%' });
    }

    if (query.search.active) {
      queryBuilder
        .andWhere('applications.isActive = :active', { active: query.search.active });
    }

    return await this.setPagination(queryBuilder, query).getMany();
  }
}
