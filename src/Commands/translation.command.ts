import { Command, Option, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CompanyService } from '../Services/company.service';
import { ApplicationService } from '../Services/application.service';
import { StringProvider } from '../Services/Provider/string.provider';
import * as faker from 'faker';
import { LanguageService } from '../Services/language.service';
import { TranslationService } from '../Services/translation.service';
import { UserService } from '../Services/user.service';
import { TranslationDto } from '../Dto/translation.dto';
import { TranslationKeyService } from '../Services/translation-key.service';

@Injectable()
export class TranslationCommand {
  constructor(
    private readonly companyService: CompanyService,
    private readonly applicationService: ApplicationService,
    private readonly stringProvider: StringProvider,
    private readonly languageService: LanguageService,
    private readonly translationService: TranslationService,
    private readonly userService: UserService,
    private readonly translationKeyService: TranslationKeyService,
  ) {
  }

  @Command({
    command: 'translation:populate <companyAlias> <applicationAlias>',
    describe: 'Create fake translations in provided application',
  })
  async create(
    @Positional({
      name: 'companyAlias',
      describe: 'The company alias',
      type: 'string',
    })
      companyAlias: string,
    @Positional({
      name: 'applicationAlias',
      describe: 'The application alias',
      type: 'string',
    })
      applicationAlias: string,
    @Option({
      name: 'amount',
      describe: 'amount of translationKey to create',
      type: 'number',
      default: 10,
    }) amount: number,
  ) {
    const company = await this.companyService.getByAliasOrFail(companyAlias);
    const application = await this.applicationService.getByAliasOrFail(company.id, applicationAlias);
    const systemUser = await this.userService.getSystemUser();

    if (!application.languagesId.length) {
      console.log(`Use the api to add at least one language to ${applicationAlias} application`);
      return;
    }

    const languages = await this.languageService.getByIds(application.languagesId);

    for (let i = 0; i < amount; i++) {
      const translationKey = this.stringProvider.removeDiacritics(faker.random.words());

      try {
        // this is to avoid repeated translation keys
        await this.translationKeyService.getByTranslationKeyInApplication(company.id, application.id, translationKey);
        continue;
      } catch (e) { }

      for (const language of languages) {

        const translationDto = new TranslationDto();
        translationDto.language = language.code;
        translationDto.translationKey = translationKey;
        translationDto.translation = faker.lorem.sentence();

        await this.translationService.persist(
          systemUser,
          application,
          translationDto,
        );
      }
    }
  }
}

