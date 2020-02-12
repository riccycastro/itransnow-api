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

  private languages: { [k: string]: Language } = {};

  public async up(queryRunner: QueryRunner): Promise<any> {
    const company = await this.populateCompany();
    const application = await this.populateApplication(company);
    const users = await this.populateUser(company);
    const languageTeams = await this.populateLanguageTeam(company, application);
    await this.joinUsersWithLanguageTeams(users, languageTeams);
    await this.joinApplicationWithLanguages(application);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DELETE FROM `language_team_users` WHERE 1');
    await queryRunner.query('DELETE FROM `application_language_teams` WHERE 1');
    await queryRunner.query('DELETE FROM `language_teams` WHERE 1');
    await queryRunner.query('DELETE FROM `users` WHERE 1');
    await queryRunner.query('DELETE FROM `applications` WHERE 1');
    await queryRunner.query('DELETE FROM `companies` WHERE 1');
  }

  private async populateCompany(): Promise<Company> {
    return await getRepository(Company).save(CompanySeed);
  }

  private async populateApplication(company: Company): Promise<Application> {
    const applicationSeed: any = ApplicationSeed;
    applicationSeed.company = company;
    return await getRepository(Application).save(applicationSeed);
  }

  private async populateUser(company: Company): Promise<User[]> {
    const userSeed: any = UserSeed;
    const bcryptProvider = new BcryptProvider();
    const users = [];

    for (const user of userSeed) {
      user.company = company;
      user.password = await bcryptProvider.hash(user.password);
      users.push(await getRepository(User).save(user));
    }

    return users;
  }

  private async populateLanguageTeam(company: Company, application: Application): Promise<LanguageTeam[]> {
    const languageTeamsSeed: any = LanguageTeamSeed;
    const languageTeams = [];

    for (const languageTeamSeed of languageTeamsSeed) {
      await this.isLanguageLoaded(languageTeamSeed.language);

      languageTeamSeed.language = this.languages[languageTeamSeed.language];
      languageTeamSeed.applications = [application];
      languageTeamSeed.company = company;
      languageTeams.push(await getRepository(LanguageTeam).save(languageTeamSeed));
    }

    return languageTeams;
  }

  private async joinUsersWithLanguageTeams(users: User[], languageTeams: LanguageTeam[]): Promise<LanguageTeamUser[]> {
    const languageTeamUsers = [];

    for (const languageTeam of languageTeams) {
      for (const user of users) {
        if (user.username !== 'system') {
          const languageTeamUser: any = { isManager: true, user: user, languageTeam: languageTeam };
          languageTeamUsers.push(await getRepository(LanguageTeamUser).save(languageTeamUser));
        }
      }
    }

    return languageTeamUsers;
  }

  private async joinApplicationWithLanguages(application: Application): Promise<Application> {
    application.languages = application.languages ?? [];

    for (const languageCode of Object.keys(this.languages)) {
      application.languages.push(this.languages[languageCode]);
    }

    return await getRepository(Application).save(application);
  }

  private async isLanguageLoaded(languageCode) {
    if (!this.languages[languageCode]) {
      this.languages[languageCode] = await getRepository(Language).findOne({ where: { code: languageCode } });
    }
  }

}
