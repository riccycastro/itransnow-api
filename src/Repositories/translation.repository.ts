import { EntityRepository } from 'typeorm';
import { Translation } from '../Entities/translation.entity';
import { AbstractRepository } from './abstract.repository';

@EntityRepository(Translation)
export class TranslationRepository extends AbstractRepository<Translation> {
  findTranslationInApplicationByLanguage(applicationId: number, languageId: number): Promise<Translation[]> {
    return this.createQueryBuilder('translations')
      .addSelect('translationKey')
      .innerJoin('translations.translationKey', 'translationKey')
      .innerJoin('translationKey.application', 'application')
      .innerJoin('application.languages', 'languages')
      .where('application.id = :applicationId', { applicationId: applicationId })
      .andWhere('application.isActive = 1')
      .andWhere('languages.id = :languageId', { languageId: languageId })
      .getMany();
  }
}
