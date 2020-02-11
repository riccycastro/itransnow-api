import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { Company } from '../src/Entities/company.entity';
import { BcryptProvider } from '../src/Services/Provider/bcrypt.provider';
import { User } from '../src/Entities/user.entity';
import { Application } from '../src/Entities/application.entity';
import { CompanySeed } from '../seeds/company.seed';
import { UserSeed } from '../seeds/user.seed';
import { ApplicationSeed } from '../seeds/application.seed';

export class Version1580911246946 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const company = await getRepository(Company).save(CompanySeed);

    const applicationSeed: any = ApplicationSeed;
    applicationSeed.company = company;
    const application = await getRepository(Application).save(applicationSeed);

    const users: any = UserSeed;

    const bcryptProvider = new BcryptProvider();

    const insertUserTaskPromise = [];

    for (const user of users) {
      user.company = company;
      user.password = await bcryptProvider.hash(user.password);
      insertUserTaskPromise.push(getRepository(User).save(user));
    }

    await Promise.all(insertUserTaskPromise);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DELETE FROM `users` WHERE 1');
    await queryRunner.query('DELETE FROM `applications` WHERE 1');
    await queryRunner.query('DELETE FROM `companies` WHERE 1');
  }
}
