import { EntityRepository } from 'typeorm';
import { Translation } from '../Entities/translation.entity';
import { AbstractRepository } from './abstract.repository';
import { TranslationStatusService } from '../Services/translation-status.service';
import { TranslationExportData } from '../Types/type';

@EntityRepository(Translation)
export class TranslationRepository extends AbstractRepository<Translation> {
  async findTranslationInApplicationByLanguage(
    applicationId: number,
    languageId: number,
    translationKeys: string[],
    sections: string[],
    whiteLabelId?: number,
  ): Promise<TranslationExportData[]> {

    let params: any = [applicationId, languageId];
    let query = this.getCommonSelect();
    query = this.addSectionSelects(query, sections);
    query = this.addWhiteLabelSelects(query, whiteLabelId);
    query = this.addFrom(query)
    query = this.joinTranslationKey(query,  whiteLabelId)
    query = this.commonJoin(query)
    query = this.joinSection(query, sections)
    query = this.commonWhere(query);
    [query, params] = this.whereTranslationKey(query, params, translationKeys);
    [query, params] = this.whereSection(query, params, sections);
    [query, params] = this.whereWhiteLabel(query, params, whiteLabelId);

    // todo@rcastro - this limit should be a configuration
    return this.query(query + ' limit 6000', params);
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

  private getCommonSelect(): string {
    return 'SELECT translations.translation, translations.translation, translation_keys.alias as `translationKey` ';
  }

  private addSectionSelects(query: string, sections: string[]): string {
    if (sections) {
      query += ' , sections.alias as `section`';
    }
    return query;
  }

  private addWhiteLabelSelects(query: string, whiteLabelId?: number): string {
    if (whiteLabelId) {
      query += ' , white_labels.alias as `white_label` ';
    }
    return query;
  }

  private addFrom(query: string): string {
    return query + ' FROM translations '
  }

  private joinTranslationKey(query: string, whiteLabelId?: number): string {
    if (whiteLabelId) {
      query += ` INNER JOIN white_label_translations ON white_label_translations.translation_id = translations.id
      INNER JOIN translation_keys ON white_label_translations.translation_key_id = translation_keys.id 
      INNER JOIN white_labels ON white_label_translations.white_label_id = white_labels.id `;
    } else {
      query += ` INNER JOIN translation_keys ON translation_keys.id = translations.translation_key_id `;
    }

    return query;
  }

  private commonJoin(query: string): string {
    return query + ` INNER JOIN translation_status ON translation_status.id = translations.translation_status_id
                 INNER JOIN applications ON applications.id = translation_keys.application_id
                 INNER JOIN languages ON languages.id = translations.language_id
    `;
  }

  private joinSection(query: string, sections: string[]): string {
    if (sections) {
      query += ` INNER JOIN section_translation_key ON section_translation_key.translation_key_id = translation_keys.id
      INNER JOIN sections ON sections.id = section_translation_key.section_id `;
    }

    return query;
  }

  private commonWhere(query: string): string {
    return query + ` WHERE applications.id = ?
        AND applications.is_active = 1
        AND languages.id = ?
        AND translation_status.status = '${TranslationStatusService.APPROVED}' `;
  }

  private whereTranslationKey(query: string, params: any[], translationKeys: string[]): [string, any[]] {
    if (translationKeys) {
      query += ' AND translation_keys.alias in (?) ';
      params.push(translationKeys);
    }
    return [query, params];
  }

  private whereSection(query: string, params: any[], sections: string[]): [string, any[]] {
    if (sections) {
      query += ' AND sections.alias in (?) ';
      params.push(sections);
    }
    return [query, params];
  }

  private whereWhiteLabel(query: string, params: any[], whiteLabelId?: number): [string, any[]] {
    if (whiteLabelId) {
      query += ' AND white_labels.id = ? AND white_labels.is_active = 1 ';
      params.push(whiteLabelId);
    }
    return [query, params];
  }
}
