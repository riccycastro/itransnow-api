import { MigrationInterface, QueryRunner } from 'typeorm';
import { BcryptProvider } from '../src/Services/Provider/bcrypt.provider';
import { UserSeed } from '../seeds/user.seed';
import { TranslationStatusSeed } from '../seeds/translation-status.seed';

export class Version1580911246946 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await this.populateUser(queryRunner);
    await this.populateTranslationStatus(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DELETE FROM `users` WHERE 1');
    await queryRunner.query('DELETE FROM `translation_status` WHERE 1');
  }

  private async populateUser(queryRunner: QueryRunner): Promise<number[]> {
    const userSeed: any = UserSeed;
    const bcryptProvider = new BcryptProvider();
    const tasks = [];

    for (const user of userSeed) {
      user.password = await bcryptProvider.hash(user.password);

      tasks.push(queryRunner.query(`INSERT INTO users(name, username, email, password, is_visible, is_admin) VALUES('${user.name}', '${user.username}', '${user.email}', '${user.password}', ${user.isVisible}, ${user.isAdmin});`));
    }

    return Promise.all(tasks).then(result => result.map(insertUser => insertUser.insertId));
  }

  private async populateTranslationStatus(queryRunner: QueryRunner): Promise<number[]> {
    const inserts = [];

    for (const translationStatusSeedElement of TranslationStatusSeed) {
      inserts.push(`('${translationStatusSeedElement.status}')`);
    }
    return queryRunner.query('INSERT INTO translation_status(status) VALUES ' + inserts.join(', '));
  }
}
