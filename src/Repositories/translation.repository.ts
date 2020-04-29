import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { Translation } from '../Entities/translation.entity';
import { AbstractRepository } from './abstract.repository';
import { TranslationStatusService } from '../Services/translation-status.service';

@EntityRepository(Translation)
export class TranslationRepository extends AbstractRepository<Translation> {
  async findTranslationInApplicationByLanguage(
    applicationId: number,
    languageId: number,
    translationKeys: string[],
    sections: string[],
  ): Promise<Translation[]> {
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
      .andWhere(
        `translationStatus.status = '${TranslationStatusService.APPROVED}'`,
      );
    return await this.commonJoins(qb, translationKeys, sections).getMany();
  }

  async findTranslationInWhiteLabelTranslationByLanguage(
    whiteLabelId: number,
    languageId: number,
    translationKeys: string[],
    sections: string[],
  ): Promise<Translation[]> {
    //todo@rcastro - consider using raw query(ex: await this.query(`SELECT * FROM USERS`);)
    //               so that it's easier to handle the data and avoid using the TranslationService.moveWhiteLabelSectionsToTranslation function
    //               and increase performance consequentially
    const qb = this.createQueryBuilder('translations')
      .addSelect('whiteLabelTranslations')
      .addSelect('translationKey')
      .innerJoin('translations.translationStatus', 'translationStatus')
      .innerJoin(
        'translations.whiteLabelTranslations',
        'whiteLabelTranslations',
      )
      .innerJoin('whiteLabelTranslations.translationKey', 'translationKey')
      .innerJoin('whiteLabelTranslations.whiteLabel', 'whiteLabel')
      .innerJoin('translations.language', 'language')
      .where('whiteLabel.id = :whiteLabelId', { whiteLabelId })
      .andWhere('language.id = :languageId', { languageId })
      .andWhere('language.isActive = 1')
      .andWhere('whiteLabel.isActive = 1')
      .andWhere(
        `translationStatus.status = '${TranslationStatusService.APPROVED}'`,
      );

    return await this.commonJoins(qb, translationKeys, sections).getMany();
  }

  async findTranslationsWithLanguageAndStatus(
    translationKeyId: number,
    whiteLabelAlias?: string,
  ): Promise<Translation[]> {
    const queryBuilder = await this.createQueryBuilder('translations')
      .innerJoinAndSelect('translations.translationStatus', 'translationStatus')
      .innerJoinAndSelect('translations.language', 'language');

    if (whiteLabelAlias) {
      queryBuilder
        .innerJoin(
          'translations.whiteLabelTranslations',
          'whiteLabelTranslations',
        )
        .innerJoin('whiteLabelTranslations.translationKey', 'translationKey')
        .innerJoin('whiteLabelTranslations.whiteLabel', 'whiteLabel')
        .andWhere('whiteLabel.alias = :whiteLabelAlias', { whiteLabelAlias });
    } else {
      queryBuilder.innerJoin('translations.translationKey', 'translationKey');
    }

    queryBuilder
      .andWhere('translations.deletedAt = 0')
      .andWhere('translationKey.id = :translationKeyId', { translationKeyId });

    return queryBuilder.getMany();
  }

  async findTranslationWithLanguageAndStatus(
    translationKeyId: number,
    whiteLabelAlias: string,
    alias: string,
  ): Promise<Translation> {
    return await this.createQueryBuilder('translation')
      .innerJoin('translation.whiteLabelTranslations', 'whiteLabelTranslations')
      .innerJoin('whiteLabelTranslations.whiteLabel', 'whiteLabel')
      .innerJoin('whiteLabelTranslations.translationKey', 'translationKey')
      .where('translationKey.id = :translationKeyId', { translationKeyId })
      .andWhere('whiteLabel.alias = :whiteLabelAlias', { whiteLabelAlias })
      .andWhere('translation.alias = :alias', { alias })
      .getOne();
  }

  private commonJoins(
    qb: SelectQueryBuilder<Translation>,
    translationKeys: string[],
    sections: string[],
  ): SelectQueryBuilder<Translation> {
    if (translationKeys) {
      qb.andWhere('translationKey.alias in (:translationKeys)', {
        translationKeys,
      });
    }

    if (sections) {
      qb.addSelect('sections')
        .innerJoin('translationKey.sections', 'sections')
        .andWhere('sections.alias in (:alias)', { alias: sections });
    }
    return qb;
  }
}
