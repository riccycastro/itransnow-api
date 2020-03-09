import { EntityRepository } from 'typeorm';
import { Translation } from '../Entities/translation.entity';
import { AbstractRepository } from './abstract.repository';
import { TranslationStatusService } from '../Services/translation-status.service';

@EntityRepository(Translation)
export class TranslationRepository extends AbstractRepository<Translation> {
  async findTranslationInApplicationByLanguage(applicationId: number, languageId: number, translationKeys: string[], sections: string[]): Promise<Translation[]> {
    const qb = this.createQueryBuilder('translations')
      .addSelect('translationKey')
      .innerJoin('translations.translationStatus', 'translationStatus')
      .innerJoin('translations.translationKey', 'translationKey')
      .innerJoin('translationKey.application', 'application')
      .innerJoin('translations.language', 'language')
      .where('application.id = :applicationId', { applicationId })
      .andWhere('application.isActive = 1')
      .andWhere('language.id = :languageId', { languageId })
      .andWhere(`translationStatus.status = '${TranslationStatusService.APPROVED}'`);

    if (translationKeys) {
      qb.andWhere('translationKey.alias in (:translationKeys)', { translationKeys });
    }

    if (sections) {
      qb
        .addSelect('sections')
        .innerJoin('translationKey.sections', 'sections')
        .andWhere('sections.alias in (:alias)', { alias: sections });
    }

    return await qb.getMany();
  }
}
