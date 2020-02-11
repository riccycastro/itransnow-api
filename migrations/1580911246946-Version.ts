import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { Company } from '../src/Entities/company.entity';
import { BcryptProvider } from '../src/Services/Provider/bcrypt.provider';
import { User } from '../src/Entities/user.entity';
import { Application } from '../src/Entities/application.entity';
import { CompanySeed } from '../seeds/company.seed';
import { UserSeed } from '../seeds/user.seed';
import { ApplicationSeed } from '../seeds/application.seed';
import { LanguageTeamSeed } from '../seeds/language-team.seed';
import { LanguageTeamUser } from '../src/Entities/language-team-user.entity';
import { Language } from '../src/Entities/language.entity';
import { LanguageTeam } from '../src/Entities/language-team.entity';

export class Version1580911246946 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const company = await getRepository(Company).save(CompanySeed);

    const applicationSeed: any = ApplicationSeed;
    applicationSeed.company = company;
    const application = await getRepository(Application).save(applicationSeed);

    const userSeed: any = UserSeed;

    const bcryptProvider = new BcryptProvider();

    const insertUserTaskPromise = [];

    for (const user of userSeed) {
      user.company = company;
      user.password = await bcryptProvider.hash(user.password);
      insertUserTaskPromise.push(getRepository(User).save(user));
    }

    const users = await Promise.all(insertUserTaskPromise);

    const languageTeamsSeed: any = LanguageTeamSeed;

    const languages: { string?: Language } = {};

    for (const languageTeamSeed of languageTeamsSeed) {
      for (const user of users) {

        if (!languages[languageTeamSeed.language]) {
          languages[languageTeamSeed.language] = await getRepository(Language).findOne({ where: { code: languageTeamSeed.language } });
        }

        languageTeamSeed.language = languages[languageTeamSeed.language];
        languageTeamSeed.applications = [application];
        languageTeamSeed.company = company;
        const languageTeam = await getRepository(LanguageTeam).save(languageTeamSeed);

        const languageTeamUser: any = { isManager: true, user: user, languageTeam: languageTeam };

        await getRepository(LanguageTeamUser).save(languageTeamUser);
      }
    }

    application.languages = application.languages ?? [];

    for (const languageCode of Object.keys(languages)) {
      application.languages.push(languages[languageCode]);
    }

    await getRepository(Application).save(application)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DELETE FROM `language_team_users` WHERE 1');
    await queryRunner.query('DELETE FROM `application_language_teams` WHERE 1');
    await queryRunner.query('DELETE FROM `language_teams` WHERE 1');
    await queryRunner.query('DELETE FROM `users` WHERE 1');
    await queryRunner.query('DELETE FROM `applications` WHERE 1');
    await queryRunner.query('DELETE FROM `companies` WHERE 1');
  }
}
