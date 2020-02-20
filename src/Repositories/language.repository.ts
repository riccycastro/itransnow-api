import { EntityRepository, Repository } from 'typeorm';
import { Language } from '../Entities/language.entity';
import { Company } from '../Entities/company.entity';

@EntityRepository(Language)
export class LanguageRepository extends Repository<Language>{
  async findByApplication(companyId: number, applicationId: number, query: any): Promise<Language[]> {
    const queryBuilder = this
      .createQueryBuilder('languages')
      .innerJoin('languages.applications', 'applications')
      .innerJoin('applications.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('applications.id = :applicationId', { applicationId: applicationId })
      .andWhere('languages.isDeleted = \'0\'');
    return await queryBuilder.getMany();
  }
}
