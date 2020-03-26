import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationRepository } from '../Repositories/application.repository';
import { ActiveApplicationDto, ApplicationDto } from '../Dto/application.dto';
import { Application } from '../Entities/application.entity';
import { remove as removeDiacritics } from 'diacritics';
import { Company } from '../Entities/company.entity';
import { LanguageService } from './language.service';
import { SectionDto } from '../Dto/section.dto';
import { Section } from '../Entities/section.entity';
import { SectionService } from './section.service';
import { LanguageToApplicationDto } from '../Dto/language.dto';
import { WhiteLabelDto } from '../Dto/white-label.dto';
import { WhiteLabelService } from './white-label.service';
import { WhiteLabel } from '../Entities/white-label.entity';
import { User } from '../Entities/user.entity';
import { TranslationDto } from '../Dto/translation.dto';
import { TranslationService } from './translation.service';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';
import { AbstractEntityListingService } from './AbstractEntityListingService';
import { Translation } from '../Entities/translation.entity';

export enum ApplicationIncludesEnum {
  language = 'language',
  sections = 'sections',
  whiteLabels = 'white-labels',
}

@Injectable()
export class ApplicationService extends AbstractEntityListingService<Application> {
  private readonly languageService: LanguageService;
  private readonly sectionService: SectionService;
  private readonly whiteLabelService: WhiteLabelService;
  private readonly translationService: TranslationService;

  constructor(
    applicationRepository: ApplicationRepository,
    languageService: LanguageService,
    @Inject(forwardRef(() => SectionService))
      sectionService: SectionService,
    @Inject(forwardRef(() => WhiteLabelService))
      whiteLabelService: WhiteLabelService,
    @Inject(forwardRef(() => TranslationService))
      translationService: TranslationService,
  ) {
    super(applicationRepository);
    this.languageService = languageService;
    this.sectionService = sectionService;
    this.whiteLabelService = whiteLabelService;
    this.translationService = translationService;
  }

  async create(createApplicationDto: ApplicationDto, companyId: number): Promise<Application> {
    createApplicationDto.alias = removeDiacritics(createApplicationDto.alias.trim().toLowerCase().replace(/ /g, '_'));

    if (await this.findByAlias(companyId, createApplicationDto.alias)) {
      throw new ConflictException();
    }

    const applicationEntity = new Application();
    applicationEntity.name = createApplicationDto.name;
    applicationEntity.alias = createApplicationDto.alias;
    applicationEntity.company = companyId as unknown as Company;
    return applicationEntity;
  }

  async findByAliasOrFail(companyId: number, alias: string, query?: any): Promise<Application> {
    const application = await this.findByAlias(companyId, alias);

    if (!application) {
      throw new NotFoundException('Application not found!');
    }

    return await this.getIncludes(companyId, application, query);
  }

  private async findByAlias(companyId: number, alias: string): Promise<Application> {
    return await this.repository.findOne({
      where: {
        alias: alias,
        company: companyId,
        isDeleted: false,
      },
    });
  }

  async findById(id: number): Promise<Application> {
    return this.repository.findOne(id);
  }

  protected async getEntityListAndCount(companyId: number, query?: QueryPaginationInterface): Promise<[Application[], number]> {
    const listResult = await (this.repository as ApplicationRepository).findInList(companyId, query);

    const applications = listResult[0];
    for (const key in applications) {
      applications[key] = await this.getIncludes(companyId, applications[key], query);
    }
    return listResult;
  }

  async delete(application: Application) {
    application.isDeleted = true;
    application.isActive = false;
    await this.save(application);
  }

  active(application: Application, activeApplicationDto: ActiveApplicationDto): Application {
    application.isActive = activeApplicationDto.isActive;
    return application;
  }

  async update(application: Application, updateApplicationDto: ApplicationDto): Promise<Application> {
    application.name = updateApplicationDto.name;
    return await this.repository.save(application);
  }

  async createSection(application: Application, sectionDto: SectionDto): Promise<Section> {
    return this.sectionService.save(
      await this.sectionService.create(sectionDto, application),
    );
  }

  async createWhiteLabel(application: Application, whiteLabelDto: WhiteLabelDto): Promise<WhiteLabel> {
    return await this.whiteLabelService.save(
      await this.whiteLabelService.create(whiteLabelDto, application),
    );
  }

  async createTranslation(user: User, application: Application, translationDto: TranslationDto): Promise<Translation> {
    return await this.translationService.persist(user, application, translationDto);
  }

  async addLanguages(application: Application, addLanguageToApplicationDto: LanguageToApplicationDto): Promise<Application> {
    //todo@rcastro - use same algorithm that was used to add translation keys to section in section.service.ts::addTranslationKeys
    const languagesList = await this.languageService.getByCodes(addLanguageToApplicationDto.languagesCode);

    if (!application.languages) {
      application.languages = await this.languageService.getByApplication(application.companyId, application.id, {});
    }

    for (const language of languagesList) {
      if (!application.languagesId.includes(language.id)) {
        application.languages.push(language);
      }
    }

    return application;
  }

  async removeLanguages(application: Application, addLanguageToApplicationDto: LanguageToApplicationDto) {
    //todo@rcastro - use same algorithm that was used to remove translation keys to section in section.service.ts::removeTranslationKeys
    const languagesList = this.languageService.indexBy(
      'code',
      await this.languageService.getByCodes(addLanguageToApplicationDto.languagesCode),
    );

    application.languages = await this.languageService.getByApplication(application.companyId, application.id, { limit: '10000' });
    application.languages = application.languages.filter(language => !Object.keys(languagesList).includes(language.code));
    return application;
  }

  protected async getIncludes(companyId: number, application: Application, query: any): Promise<Application> {

    if (!query || !query.includes) {
      return application;
    }

    if (query.includes.includes('language')) {
      application.languages = await this.languageService.getByApplication(companyId, application.id, {});
    }

    if (query.includes.includes('sections')) {
      application.sections = await this.sectionService.findByApplication(companyId, application.id, {});
    }

    if (query.includes.includes('white-labels')) {
      application.whiteLabels = await this.whiteLabelService.findByApplication(companyId, application.id, {});
    }

    return application;
  }
}
