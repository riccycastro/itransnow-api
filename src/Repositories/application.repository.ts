import { EntityManager, EntityRepository } from 'typeorm';
import { Application } from '../Entities/application.entity';
import { AbstractRepository, QueryPaginationInterface } from './abstract.repository';
import { StringIndexedByString } from '../Types/type';
import { Language } from '../Entities/language.entity';

@EntityRepository(Application)
export class ApplicationRepository extends AbstractRepository<Application> {
  async findInList(
    companyId: number,
    query: QueryPaginationInterface,
  ): Promise<[Application[], number]> {
    const queryBuilder = this.listQuery(companyId, query);
    return await this.setPagination(
      queryBuilder,
      query,
      'applications',
    ).getManyAndCount();
  }

  async countList(
    companyId: number,
    query: StringIndexedByString,
  ): Promise<number> {
    return this.listQuery(companyId, query).getCount();
  }

  private listQuery(companyId: number, query: QueryPaginationInterface) {
    let queryBuilder = this.createQueryBuilder('applications')
      .innerJoin('applications.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere("applications.deletedAt = '0'");

    queryBuilder = this.queryName(queryBuilder, 'applications', query);
    queryBuilder = this.queryAlias(queryBuilder, 'applications', query);
    queryBuilder = this.queryActive(queryBuilder, 'applications', query);
    return queryBuilder;
  }

  async assignLanguage(
    application: Application,
    language: Language,
    entityManager: EntityManager,
  ): Promise<void> {
    await entityManager
      .createQueryBuilder(entityManager.queryRunner)
      .relation(Application, 'languages')
      .of(application)
      .add(language);
  }

  async removeLanguage(
    application: Application,
    language: Language,
  ): Promise<void> {
    await this.createQueryBuilder()
      .relation('languages')
      .of(application)
      .remove(language);
  }
}
