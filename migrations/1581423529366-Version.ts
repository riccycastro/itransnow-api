import { MigrationInterface, QueryRunner } from 'typeorm';
import { TranslationStatusSeed } from '../seeds/translation-status.seed';
import { SectionSeed } from '../seeds/section.seed';
import { TranslationKeySeed } from '../seeds/translation-key.seed';
import { TranslationSeed } from '../seeds/translation.seed';
import { Translation } from '../src/Entities/translation.entity';
import { ApplicationSeed } from '../seeds/application.seed';

export class Version1581423529366 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const applicationId = await this.getApplicationId(queryRunner);
    const usersId = await this.getUsersId(queryRunner);
    const languagesId = await this.getLanguagesIds(queryRunner);
    await this.populateTranslationStatus(queryRunner);
    const sectionsId = await this.populateSection(applicationId, queryRunner);
    const translationKeysId = await this.populateTranslationKey(applicationId, queryRunner);

    await this.joinSectionWithTranslationKeys(sectionsId, translationKeysId, queryRunner);
    await this.populateTranslations(usersId, translationKeysId, languagesId, queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DELETE FROM `translations` WHERE 1');
    await queryRunner.query('DELETE FROM `section_translation_key` WHERE 1');
    await queryRunner.query('DELETE FROM `translation_keys` WHERE 1');
    await queryRunner.query('DELETE FROM `sections` WHERE 1');
    await queryRunner.query('DELETE FROM `translation_status` WHERE 1');
  }

  private async populateTranslationStatus(queryRunner: QueryRunner): Promise<number[]> {
    const inserts = [];

    for (const translationStatusSeedElement of TranslationStatusSeed) {
      inserts.push(`('${translationStatusSeedElement.status}')`);
    }
    return queryRunner.query('INSERT INTO translation_status(status) VALUES ' + inserts.join(', '));
  }

  private async populateSection(applicationId: number, queryRunner: QueryRunner): Promise<number[]> {
    const tasks = [];
    for (const sectionSeedElement of SectionSeed) {
      tasks.push(queryRunner.query(`INSERT INTO sections(name, alias, application_id) VALUES ('${sectionSeedElement.name}', '${sectionSeedElement.alias}', ${applicationId})`));
    }
    return Promise.all(tasks).then(result => result.map(insertSection => insertSection.insertId));
  }

  private async populateTranslationKey(applicationId: number, queryRunner: QueryRunner): Promise<number[]> {
    const tasks = [];
    for (const translationKeySeedElement of TranslationKeySeed) {
      tasks.push(queryRunner.query(`INSERT INTO translation_keys(alias, application_id) VALUES('${translationKeySeedElement.alias}', ${applicationId})`));
    }
    return Promise.all(tasks).then(result => result.map(insertTranslationKey => insertTranslationKey.insertId));
  }

  private async joinSectionWithTranslationKeys(sectionsId: number[], translationKeysId: number[], queryRunner: QueryRunner) {

    const query = 'INSERT INTO section_translation_key(section_id, translation_key_id) VALUES ';
    const inserts = [];

    for (const sectionId of sectionsId) {
      for (const translationKeyId of translationKeysId) {
        inserts.push(`(${sectionId}, ${translationKeyId})`);
      }
    }

    return queryRunner.query(query + inserts.join(', '));
  }

  private async populateTranslations(
    usersId: number[],
    translationKeysId: number[],
    languagesId: number[],
    queryRunner: QueryRunner,
  ): Promise<Translation[]> {
    const translationSeed = TranslationSeed;

    let translationKeyCounter = 0;
    let languagesCounter = 0;
    const inserts = [];

    const translationStatusId = await this.getApprovedTranslationStatusId(queryRunner);

    for (const translationSeedElement of translationSeed) {
      inserts.push(`('${usersId[0]}', '${usersId[1]}', ${translationStatusId}, ${translationKeysId[translationKeyCounter]}, ${languagesId[languagesCounter]}, '${translationSeedElement.translation}')`);

      translationKeyCounter++;
      if (translationKeyCounter === translationKeysId.length) {
        translationKeyCounter = 0;
      }

      languagesCounter++;
      if (languagesCounter === languagesId.length) {
        languagesCounter = 0;
      }
    }

    return queryRunner.query('INSERT INTO translations(accepted_by, created_by, translation_status_id, translation_key_id, language_id, translation) VALUES ' + inserts.join(', '));
  }

  private async getApplicationId(queryRunner: QueryRunner): Promise<number> {
    const application = await queryRunner.query(`SELECT id FROM applications WHERE alias = '${ApplicationSeed.alias}'`);
    return application[0].id;
  }

  private async getUsersId(queryRunner: QueryRunner): Promise<number[]> {
    const users = await queryRunner.query(`SELECT id FROM users;`);
    return users.map(user => user.id);
  }

  private async getLanguagesIds(queryRunner: QueryRunner) {
    const languages = await queryRunner.query(`SELECT id FROM languages WHERE code in ('pt', 'fr', 'en')`);
    return languages.map(language => language.id);
  }

  private async getApprovedTranslationStatusId(queryRunner: QueryRunner) {
    const translationStatus = await queryRunner.query(`SELECT id FROM translation_status WHERE status = 'approved';`);
    return translationStatus[0].id;
  }
}
