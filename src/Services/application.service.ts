import {ConflictException, forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {AbstractEntityService} from './AbstractEntityService';
import {ApplicationRepository} from '../Repositories/application.repository';
import {ApplicationDto} from '../Dto/application.dto';
import {Application} from '../Entities/application.entity';
import {remove as removeDiacritics} from 'diacritics';
import {Company} from '../Entities/company.entity';
import {LanguageService} from './language.service';
import {SectionDto} from '../Dto/section.dto';
import {Section} from '../Entities/section.entity';
import {SectionService} from './section.service';
import {AddLanguageToApplicationDto} from '../Dto/language.dto';
import {Language} from "../Entities/language.entity";
import { WhiteLabelDto } from '../Dto/white-label.dto';
import { WhiteLabelService } from './white-label.service';

@Injectable()
export class ApplicationService extends AbstractEntityService<Application> {
  private readonly languageService: LanguageService;
  private readonly sectionService: SectionService;
  private readonly whiteLabelService: WhiteLabelService;

  constructor(
      applicationRepository: ApplicationRepository,
      languageService: LanguageService,
      @Inject(forwardRef(() => SectionService))
          sectionService: SectionService,
      whiteLabelService: WhiteLabelService,
  ) {
    super(applicationRepository);
    this.languageService = languageService;
    this.sectionService = sectionService;
    this.whiteLabelService = whiteLabelService;
  }

  async create(createApplicationDto: ApplicationDto, company: Company): Promise<Application> {
    createApplicationDto.alias = removeDiacritics(createApplicationDto.alias.trim().toLowerCase().replace(/ /g, '_'));

    if (await this.findByAlias(company.id, createApplicationDto.alias)) {
      throw new ConflictException();
    }

    const applicationEntity = new Application();
    applicationEntity.name = createApplicationDto.name;
    applicationEntity.alias = createApplicationDto.alias;
    applicationEntity.company = company;
    return applicationEntity;
  }

  async findByAlias(companyId: number, alias: string, query?: any): Promise<Application> {
    const application = await this.repository.findOne({
      where: {
        alias: alias,
        company: companyId,
        isDeleted: false,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found!');
    }

    return await this.getIncludes(companyId, application, query);
  }

  async findById(id: number): Promise<Application> {
    return this.repository.findOne(id);
  }

  async findInList(companyId: number, query?: any): Promise<Application[]> {
    const applications = await (this.repository as ApplicationRepository).findInList(companyId, query);

    for (const key in applications) {
      applications[key] = await this.getIncludes(companyId, applications[key], query);
    }

    return applications;
  }

  async delete(application: Application | null) {
    application.isDeleted = true;
    await this.save(application);
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

  async createWhiteLabel(application: Application, whiteLabelDto: WhiteLabelDto) {

  }

  async addLanguages(application: Application, addLanguageToApplicationDto: AddLanguageToApplicationDto) {
    const languagesList = await this.languageService.findByCodes(addLanguageToApplicationDto.languagesCode) as Language[];

    if (!application.languages) {
      application.languages = await this.languageService.findByApplication(application.companyId, application.id, {});
    }

    for (const language of languagesList) {
      if (!application.languagesId.includes(language.id)) {
        application.languages.push(language);
      }
    }

    return application;
  }

  protected async getIncludes(companyId: number, application: Application, query: any): Promise<Application> {

    if (!query || !query.includes) {
      return application;
    }

    if (query.includes.includes('language')) {
      application.languages = await this.languageService.findByApplication(companyId, application.id, {});
    }

    if (query.includes.includes('sections')) {
      application.sections = await this.sectionService.findByApplication(companyId, application.id, {});
    }

    return application;
  }
}
