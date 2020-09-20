import { MigrationInterface, QueryRunner } from 'typeorm';
import { BcryptProvider } from '../src/Services/Provider/bcrypt.provider';
import { Application } from '../src/Entities/application.entity';
import { CompanySeed } from '../seeds/company.seed';
import { UserSeed } from '../seeds/user.seed';
import { ApplicationSeed } from '../seeds/application.seed';

export class Version1580911246946 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const companyId = await this.populateCompany(queryRunner);
    const applicationId = await this.populateApplication(companyId, queryRunner);
    await this.populateUser(companyId, queryRunner);
    const languages = await this.getLanguagesIds(queryRunner);
    await this.joinApplicationWithLanguages(applicationId, languages, queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DELETE FROM `application_languages` WHERE 1');
    await queryRunner.query('DELETE FROM `users` WHERE 1');
    await queryRunner.query('DELETE FROM `applications` WHERE 1');
    await queryRunner.query('DELETE FROM `companies` WHERE 1');
  }

  private async populateCompany(queryRunner: QueryRunner): Promise<number> {
    const insertResult = await queryRunner.query(`INSERT INTO companies(\`name\`, \`alias\`) VALUES('${CompanySeed.name}', '${CompanySeed.alias}');`);
    return insertResult.insertId;
  }

  private async populateApplication(companyId: number, queryRunner: QueryRunner): Promise<number> {
    const insertResult = await queryRunner.query(`INSERT INTO applications(\`name\`, \`alias\`, \`company_id\`) VALUES('${ApplicationSeed.name}', '${ApplicationSeed.alias}', '${companyId}');`);
    return insertResult.insertId;
  }

  private async populateUser(companyId: number, queryRunner: QueryRunner): Promise<number[]> {
    const userSeed: any = UserSeed;
    const bcryptProvider = new BcryptProvider();
    const tasks = [];

    for (const user of userSeed) {
      user.password = await bcryptProvider.hash(user.password);

      tasks.push(queryRunner.query(`INSERT INTO users(name, username, email, password, is_visible, is_admin, company_id) VALUES('${user.name}', '${user.username}', '${user.email}', '${user.password}', ${user.isVisible}, ${user.isAdmin}, ${companyId});`));
    }

    return Promise.all(tasks).then(result => result.map(insertUser => insertUser.insertId));
  }

  private async joinApplicationWithLanguages(applicationId: number, languagesId: number[], queryRunner: QueryRunner): Promise<Application> {
    const insertsValues = [];

    const query = `INSERT INTO application_languages(application_id, language_id) VALUES `;

    for (const languageId of languagesId) {
      insertsValues.push(`(${applicationId}, ${languageId})`)
    }

    return queryRunner.query(query + insertsValues.join(', '));
  }

  private async getLanguagesIds(queryRunner: QueryRunner) {
    const languages = await queryRunner.query(`SELECT id, code FROM languages WHERE code in ('pt', 'fr', 'en')`);
    return languages.map(language => language.id);
  }
}
