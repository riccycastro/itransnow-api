import { getRepository, In, MigrationInterface, QueryRunner } from 'typeorm';
import { TranslationStatusSeed } from '../seeds/translation-status.seed';
import { SectionSeed } from '../seeds/section.seed';
import { TranslationKeySeed } from '../seeds/translation-key.seed';
import { TranslationStatus } from '../src/Entities/translation-status.entity';
import { Application } from '../src/Entities/application.entity';
import { Section } from '../src/Entities/section.entity';
import { TranslationKey } from '../src/Entities/translation-key.entity';
import { User } from '../src/Entities/user.entity';
import { Language } from '../src/Entities/language.entity';

export class Version1581423529366 implements MigrationInterface {

  private readonly applicationId = 1;

  public async up(queryRunner: QueryRunner): Promise<any> {
    const application = await getRepository(Application).findOneOrFail(this.applicationId);
    const users = await getRepository(User).find();
    const languages = await getRepository(Language).find({ where: { code: In(['pt', 'fr', 'en']) } });
    const translationStatus = await this.populateTranslationStatus();
    const sections = await this.populateSection(application);
    const translationKeys = await this.populateTranslationKey(application);
    this.joinSectionsWithTranslations(sections, translationKeys);


  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DELETE FROM `translation_status` WHERE 1');
  }

  private async populateTranslationStatus(): Promise<TranslationStatus[]> {
    const insertTranslationStatusTaskPromise = [];
    for (const translationStatusSeedElement of TranslationStatusSeed) {
      insertTranslationStatusTaskPromise.push(getRepository(TranslationStatus).save(translationStatusSeedElement));
    }
    return await Promise.all(insertTranslationStatusTaskPromise);
  }

  private async populateSection(application: Application): Promise<Section[]> {
    const insertSectionTaskPromise = [];
    for (const sectionSeedElement of SectionSeed) {
      sectionSeedElement.application = application;
      insertSectionTaskPromise.push(getRepository(Section).save(sectionSeedElement));
    }
    return await Promise.all(insertSectionTaskPromise);
  }

  private async populateTranslationKey(application: Application): Promise<TranslationKey[]> {
    const insertTranslationKeyTaskPromise = [];
    for (const translationKeySeedElement of TranslationKeySeed) {
      translationKeySeedElement.application = application;
      insertTranslationKeyTaskPromise.push(getRepository(TranslationKey).save(translationKeySeedElement));
    }
    return await Promise.all(insertTranslationKeyTaskPromise);
  }

  private async joinSectionsWithTranslations(sections: Section[], translationKeys: TranslationKey[]) {
    for (const section of sections) {
      let slicedTranslationKeys = [];

      if (section.alias === 'home_page') {
        slicedTranslationKeys = translationKeys.slice(0, 2);
      } else {
        translationKeys.slice(2, 4);
      }

      this.joinSectionWithTranslationKeys(section, slicedTranslationKeys);
    }
  }

  private async joinSectionWithTranslationKeys(section: Section, translationKeys: TranslationKey[]) {
    section.translationKeys = translationKeys;
    await getRepository(Section).save(section);
  }
}
