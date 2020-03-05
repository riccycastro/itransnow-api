import { EntityManager, EntityRepository } from 'typeorm';
import { Section } from '../Entities/section.entity';
import { AbstractRepository, QueryPaginationInterface } from './abstract.repository';
import { TranslationKey } from '../Entities/translation-key.entity';

@EntityRepository(Section)
export class SectionRepository extends AbstractRepository<Section> {
  async findByApplication(companyId: number, applicationId: number, query: QueryPaginationInterface): Promise<Section[]> {
    const queryBuilder = this
      .createQueryBuilder('sections')
      .innerJoin('sections.application', 'application')
      .innerJoin('application.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('application.id = :applicationId', { applicationId: applicationId })
      .andWhere('sections.isDeleted = \'0\'');
    return await this.setPagination(queryBuilder, query, 'application').getMany();
  }

  async findInList(companyId: number, query: QueryPaginationInterface): Promise<Section[]> {
    let queryBuilder = this.createQueryBuilder('sections')
      .innerJoin('sections.application', 'application')
      .innerJoin('application.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('sections.isDeleted = \'0\'');

    queryBuilder = this.queryName(queryBuilder, 'sections', query.search);
    queryBuilder = this.queryAlias(queryBuilder, 'sections', query.search);
    queryBuilder = this.queryActive(queryBuilder, 'sections', query.search);

    return await this.setPagination(queryBuilder, query, 'application').getMany();
  }

  async findByAlias(companyId: number, alias: string): Promise<Section> {
    return await this.createQueryBuilder('section')
      .innerJoin('section.application', 'application')
      .innerJoin('application.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('section.alias LIKE :alias', { alias: alias })
      .getOne();
  }

  async insertTranslationKey(section: Section, translationKey: TranslationKey, entityManager: EntityManager) {
    await entityManager.createQueryBuilder(entityManager.queryRunner)
      .relation(Section, 'translationKeys')
      .of(section)
      .add(translationKey);
  }
}
