import { EntityRepository } from 'typeorm';
import { TranslationKey } from '../Entities/translation-key.entity';
import { AbstractRepository } from './abstract.repository';

@EntityRepository(TranslationKey)
export class TranslationKeyRepository extends AbstractRepository<TranslationKey> {
    async findByTranslationKeyInApplication(companyId: number, applicationId: number, translationKey: string): Promise<TranslationKey> {
        return this.createQueryBuilder('translationKeys')
          .innerJoin('translationKeys.application', 'application')
          .innerJoin('application.company', 'company')
          .where('company.id = :companyId', { companyId: companyId })
          .andWhere('company.deletedAt = 0')
          .andWhere('company.isActive = 1')
          .andWhere('application.deletedAt = 0')
          .andWhere('application.isActive = 1')
          .andWhere('application.id = :applicationId', { applicationId: applicationId })
          .andWhere('translationKeys.alias = :translationKey', { translationKey: translationKey })
          .getOne();
    }

    async findByTranslationKeysInApplication(companyId: number, translationKeys: string[]): Promise<TranslationKey[]> {
        return await this.createQueryBuilder('translationKeys')
          .innerJoin('translationKeys.application', 'application')
          .innerJoin('application.company', 'company')
          .where('company.id = :companyId', { companyId: companyId })
          .andWhere('company.deletedAt = 0')
          .andWhere('company.isActive = 1')
          .andWhere('application.deletedAt = 0')
          .andWhere('application.isActive = 1')
          .andWhere('translationKeys.alias in (:translationKey)', { translationKey: translationKeys })
          .getMany();
    }
}
