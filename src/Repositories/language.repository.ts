import { EntityRepository, In } from 'typeorm';
import { Language } from '../Entities/language.entity';
import { AbstractRepository } from './abstract.repository';
import { StringIndexedByString } from '../Types/type';

@EntityRepository(Language)
export class LanguageRepository extends AbstractRepository<Language> {
  async findByApplication(companyId: number, applicationId: number, query: StringIndexedByString): Promise<Language[]> {
    const queryBuilder = this
        .createQueryBuilder('languages')
        .innerJoin('languages.applications', 'applications')
        .innerJoin('applications.company', 'company')
        .where('company.id = :companyId', {companyId: companyId})
        .andWhere('applications.id = :applicationId', {applicationId: applicationId})
        .andWhere('languages.isDeleted = \'0\'');
    return await this.setPagination(queryBuilder, query, 'languages').getMany();
  }

  async findByCodes(companyId: number, codes: string[]): Promise<Language[]> {
    return await this.createQueryBuilder('languages')
        .innerJoin('languages.applications', 'applications')
        .innerJoin('applications.company', 'company')
        .where('company.id = :companyId', {companyId: companyId})
        .andWhere('languages.code in :code', {code: In(codes)})
        .getMany();
  }

  async findByCodeInApplication(applicationId: number, code: string): Promise<Language> {
    return await this.createQueryBuilder('languages')
        .innerJoin('languages.applications', 'applications')
        .where('applications.id = :applicationId', {applicationId: applicationId})
        .andWhere('languages.code = :code', {code: code})
        .getOne();
  }
}
