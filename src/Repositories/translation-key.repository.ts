import { EntityRepository } from 'typeorm';
import { TranslationKey } from '../Entities/translation-key.entity';
import { AbstractRepository, QueryPaginationInterface } from './abstract.repository';

@EntityRepository(TranslationKey)
export class TranslationKeyRepository extends AbstractRepository<
  TranslationKey
> {
  async findByTranslationKeyInApplication(
    companyId: number,
    applicationId: number,
    translationKey: string,
  ): Promise<TranslationKey> {
    return this.createQueryBuilder('translationKeys')
      .innerJoin('translationKeys.application', 'application')
      .innerJoin('application.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('company.deletedAt = 0')
      .andWhere('company.isActive = 1')
      .andWhere('application.deletedAt = 0')
      .andWhere('application.isActive = 1')
      .andWhere('application.id = :applicationId', {
        applicationId: applicationId,
      })
      .andWhere('translationKeys.alias = :translationKey', {
        translationKey: translationKey,
      })
      .getOne();
  }

  async findByTranslationKeysInApplication(
    companyId: number,
    translationKeys: string[],
  ): Promise<TranslationKey[]> {
    return await this.createQueryBuilder('translationKeys')
      .innerJoin('translationKeys.application', 'application')
      .innerJoin('application.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('company.deletedAt = 0')
      .andWhere('company.isActive = 1')
      .andWhere('application.deletedAt = 0')
      .andWhere('application.isActive = 1')
      .andWhere('translationKeys.alias in (:translationKey)', {
        translationKey: translationKeys,
      })
      .getMany();
  }

  async findByAlias(
    applicationId: number,
    alias: string,
  ): Promise<TranslationKey> {
    return this.createQueryBuilder('translationKey')
      .innerJoin('translationKey.application', 'application')
      .where('application.id = :applicationId', { applicationId })
      .andWhere('translationKey.alias LIKE :alias', { alias: alias })
      .andWhere('translationKey.deletedAt = 0')
      .andWhere('application.deletedAt = 0')
      .getOne();
  }

  async findInList(
    applicationId: number,
    query: QueryPaginationInterface,
  ): Promise<[TranslationKey[], number]> {
    let queryBuilder = this.createQueryBuilder('translationKeys')
      .innerJoin('translationKeys.application', 'application')
      .where('application.id = :applicationId', { applicationId })
      .andWhere('translationKeys.deletedAt = 0')
      .andWhere('application.deletedAt = 0');

    queryBuilder = this.queryAlias(queryBuilder, 'translationKeys', query);
    queryBuilder = this.queryActive(queryBuilder, 'translationKeys', query);

    return await this.setPagination(
      queryBuilder,
      query,
      'translationKeys',
    ).getManyAndCount();
  }
}
