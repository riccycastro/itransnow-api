import { EntityRepository } from 'typeorm';
import { Language } from '../Entities/language.entity';
import { AbstractRepository, QueryPaginationInterface } from './abstract.repository';

@EntityRepository(Language)
export class LanguageRepository extends AbstractRepository<Language>{
  async findByApplication(companyId: number, applicationId: number, query: QueryPaginationInterface): Promise<Language[]> {
    const queryBuilder = this
      .createQueryBuilder('languages')
      .innerJoin('languages.applications', 'applications')
      .innerJoin('applications.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('applications.id = :applicationId', { applicationId: applicationId })
      .andWhere('languages.isDeleted = \'0\'');
    return await this.setPagination(queryBuilder, query).getMany();
  }
}
