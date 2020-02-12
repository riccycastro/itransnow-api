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
import { LanguageTeam } from '../src/Entities/language-team.entity';
import { TranslationSeed } from '../seeds/translation.seed';
import { Translation } from '../src/Entities/translation.entity';

export class Version1581423529366 implements MigrationInterface {

  private readonly applicationId = 1;

  public async up(queryRunner: QueryRunner): Promise<any> {
    const application = await getRepository(Application).findOneOrFail(this.applicationId);
    const users = await getRepository(User).find();
    const languages = await getRepository(Language).find({ where: { code: In(['pt', 'fr', 'en']) } });
    const languageTeams = await getRepository(LanguageTeam).find();
    const translationStatus = await this.populateTranslationStatus();
    const sections = await this.populateSection(application);
    const translationKeys = await this.populateTranslationKey(application);
    await this.joinSectionsWithTranslations(sections, translationKeys);
    await this.populateTranslations(users, translationStatus[1], translationKeys, languages, languageTeams);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DELETE FROM `translations` WHERE 1');
    await queryRunner.query('DELETE FROM `section_translation_key` WHERE 1');
    await queryRunner.query('DELETE FROM `translation_keys` WHERE 1');
    await queryRunner.query('DELETE FROM `sections` WHERE 1');
    await queryRunner.query('DELETE FROM `translation_status` WHERE 1');
  }

  private async populateTranslationStatus(): Promise<TranslationStatus[]> {
    const translationStatus = [];
    for (const translationStatusSeedElement of TranslationStatusSeed) {
      translationStatus.push(await getRepository(TranslationStatus).save(translationStatusSeedElement));
    }
    return translationStatus;
  }

  private async populateSection(application: Application): Promise<Section[]> {
    const sections = [];
    for (const sectionSeedElement of SectionSeed) {
      sectionSeedElement.application = application;
      sections.push(await getRepository(Section).save(sectionSeedElement));
    }
    return sections;
  }

  private async populateTranslationKey(application: Application): Promise<TranslationKey[]> {
    const translationKeys = [];
    for (const translationKeySeedElement of TranslationKeySeed) {
      translationKeySeedElement.application = application;
      translationKeys.push(await getRepository(TranslationKey).save(translationKeySeedElement));
    }
    return translationKeys;
  }

  private async joinSectionsWithTranslations(sections: Section[], translationKeys: TranslationKey[]) {
    for (const section of sections) {
      let slicedTranslationKeys = [];

      if (section.alias === 'home_page') {
        slicedTranslationKeys = translationKeys.slice(0, 2);
      } else {
        slicedTranslationKeys = translationKeys.slice(2, 4);
      }

      await this.joinSectionWithTranslationKeys(section, slicedTranslationKeys);
    }
  }

  private async joinSectionWithTranslationKeys(section: Section, translationKeys: TranslationKey[]) {
    section.translationKeys = translationKeys;
    await getRepository(Section).save(section);
  }

  private async populateTranslations(
    users: User[],
    translationStatus: TranslationStatus,
    translationKeys: TranslationKey[],
    languages: Language[],
    languageTeams: LanguageTeam[],
  ): Promise<Translation[]> {
    const translationSeed = TranslationSeed;
    const translations = [];

    let translationKeyCounter = 0;
    let languagesCounter = 0;
    let languageTeamCounter = 0;

    for (const translationSeedElement of translationSeed) {
      translationSeedElement.acceptedBy = users[0];
      translationSeedElement.createdBy = users[1];
      translationSeedElement.translationStatus = translationStatus;
      translationSeedElement.translationKey = translationKeys[translationKeyCounter];
      translationSeedElement.language = languages[languagesCounter];
      translationSeedElement.languageTeam = languageTeams[languageTeamCounter];

      translations.push(await getRepository(Translation).save(translationSeedElement));

      translationKeyCounter++;
      if (translationKeyCounter === translationKeys.length) {
        translationKeyCounter = 0;
      }

      languagesCounter++;
      if (languagesCounter === languages.length) {
        languagesCounter = 0;
      }

      languageTeamCounter++;
      if (languageTeamCounter === languageTeams.length) {
        languageTeamCounter = 0;
      }
    }

    return translations;
  }
}
