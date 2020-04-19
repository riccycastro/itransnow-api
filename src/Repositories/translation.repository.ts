import { EntityRepository, SelectQueryBuilder } from 'typeorm';
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
      .andWhere('language.isActive = 1')
      .andWhere(`translationStatus.status = '${TranslationStatusService.APPROVED}'`);
    return await this.commonJoins(qb, translationKeys, sections).getMany();
  }

  async findTranslationInWhiteLabelTranslationByLanguage(whiteLabelId: number, languageId: number, translationKeys: string[], sections: string[]): Promise<Translation[]> {
    //todo@rcastro - consider using raw query(ex: await this.query(`SELECT * FROM USERS`);)
    //               so that it's easier to handle the data and avoid using the TranslationService.moveWhiteLabelSectionsToTranslation function
    //               and increase performance consequentially
    const qb = this.createQueryBuilder('translations')
      .addSelect('whiteLabelTranslations')
      .addSelect('translationKey')
      .innerJoin('translations.translationStatus', 'translationStatus')
      .innerJoin('translations.whiteLabelTranslations', 'whiteLabelTranslations')
      .innerJoin('whiteLabelTranslations.translationKey', 'translationKey')
      .innerJoin('whiteLabelTranslations.whiteLabel', 'whiteLabel')
      .innerJoin('translations.language', 'language')
      .where('whiteLabel.id = :whiteLabelId', { whiteLabelId })
      .andWhere('language.id = :languageId', { languageId })
      .andWhere('language.isActive = 1')
      .andWhere('whiteLabel.isActive = 1')
      .andWhere(`translationStatus.status = '${TranslationStatusService.APPROVED}'`);

    return await this.commonJoins(qb, translationKeys, sections).getMany();
  }

  private commonJoins(qb: SelectQueryBuilder<Translation>, translationKeys: string[], sections: string[]): SelectQueryBuilder<Translation> {
    if (translationKeys) {
      qb.andWhere('translationKey.alias in (:translationKeys)', { translationKeys });
    }

    if (sections) {
      qb
        .addSelect('sections')
        .innerJoin('translationKey.sections', 'sections')
        .andWhere('sections.alias in (:alias)', { alias: sections });
    }
    return qb;
  }
}
