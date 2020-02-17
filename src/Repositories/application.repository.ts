import { EntityRepository, Repository } from 'typeorm';
import { Application } from '../Entities/application.entity';
import { Company } from '../Entities/company.entity';

@EntityRepository(Application)
export class ApplicationRepository extends Repository<Application> {
  async findInList(company: Company, query: any): Promise<Application[]> {
    const queryBuilder = this.createQueryBuilder('applications')
      .innerJoin('applications.company', 'company')
      .where('company.id = :companyId', { companyId: company.id })
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

    queryBuilder
      .limit(query.limit)
      .offset(query.offset);

    return await queryBuilder.getMany();
  }
}
