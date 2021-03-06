import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationRepository } from '../Repositories/application.repository';
import { ActiveApplicationDto, ApplicationDto } from '../Dto/application.dto';
import { Application } from '../Entities/application.entity';
import { LanguageService } from './language.service';
import { SectionDto } from '../Dto/section.dto';
import { Section } from '../Entities/section.entity';
import { SectionService } from './section.service';
import { LanguageToApplicationDto } from '../Dto/language.dto';
import { ActiveWhiteLabelDto, WhiteLabelDto } from '../Dto/white-label.dto';
import { WhiteLabelService } from './white-label.service';
import { WhiteLabel } from '../Entities/white-label.entity';
import { User } from '../Entities/user.entity';
import { TranslationDto } from '../Dto/translation.dto';
import { TranslationService } from './translation.service';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';
import { AbstractEntityListingService } from './abstract-entity-listing.service';
import { Translation } from '../Entities/translation.entity';
import { MomentProvider } from './Provider/moment.provider';
import { QueryRunnerProvider } from './Provider/query-runner.provider';
import { ListResult } from '../Types/type';
import { WhiteLabelTranslationDto } from '../Dto/white-label-translation.dto';
import { WhiteLabelTranslation } from '../Entities/white-label-translation.entity';
import { StringProvider } from './Provider/string.provider';
import { TranslationKeyService } from './translation-key.service';
import { TranslationKey } from '../Entities/translation-key.entity';

export enum ApplicationIncludesEnum {
  language = 'languages',
  sections = 'sections',
  whiteLabels = 'white-labels',
}

@Injectable()
export class ApplicationService extends AbstractEntityListingService<
  Application
> {
  constructor(
    applicationRepository: ApplicationRepository,
    private readonly languageService: LanguageService,
    @Inject(forwardRef(() => SectionService))
    private readonly sectionService: SectionService,
    @Inject(forwardRef(() => WhiteLabelService))
    private readonly whiteLabelService: WhiteLabelService,
    @Inject(forwardRef(() => TranslationService))
    private readonly translationService: TranslationService,
    private readonly momentProvider: MomentProvider,
    private readonly queryRunnerProvider: QueryRunnerProvider,
    private readonly stringProvider: StringProvider,
    private readonly translationKeyService: TranslationKeyService,
  ) {
    super(applicationRepository);
  }

  async create(
    createApplicationDto: ApplicationDto,
    companyId: number,
  ): Promise<Application> {
    createApplicationDto.alias = this.stringProvider.removeDiacritics(
      createApplicationDto.alias,
    );

    if (await this.findByAlias(companyId, createApplicationDto.alias)) {
      throw new ConflictException();
    }

    const applicationEntity = new Application();
    applicationEntity.name = createApplicationDto.name;
    applicationEntity.alias = createApplicationDto.alias;
    applicationEntity.company = companyId;
    return applicationEntity;
  }

  async getByAliasOrFail(
    companyId: number,
    alias: string,
    query?: QueryPaginationInterface,
  ): Promise<Application> {
    const application = await this.findByAlias(companyId, alias);

    if (!application) {
      throw new NotFoundException(`Application ${alias} not found!`);
    }

    return await this.getIncludes(companyId, application, query);
  }

  private async findByAlias(
    companyId: number,
    alias: string,
  ): Promise<Application> {
    return await this.repository.findOne({
      where: {
        alias: alias,
        company: companyId,
        deletedAt: 0,
      },
    });
  }

  async getById(id: number): Promise<Application> {
    return this.repository.findOne(id);
  }

  protected async getEntityListAndCount(
    companyId: number,
    query?: QueryPaginationInterface,
  ): Promise<[Application[], number]> {
    const listResult = await (this
      .repository as ApplicationRepository).findInList(companyId, query);

    for await (let application of listResult[0]) {
      application = await this.getIncludes(companyId, application, query);
    }

    return listResult;
  }

  async delete(application: Application): Promise<Application> {
    application.deletedAt = this.momentProvider.utc().unix();
    application.isActive = false;
    return await this.save(application);
  }

  active(
    application: Application,
    activeApplicationDto: ActiveApplicationDto,
  ): Application {
    application.isActive = activeApplicationDto.isActive;
    return application;
  }

  async update(
    application: Application,
    updateApplicationDto: ApplicationDto,
  ): Promise<Application> {
    application.name = updateApplicationDto.name;

    if (updateApplicationDto.isActive !== undefined) {
      application.isActive = updateApplicationDto.isActive;
    }

    return await this.save(application);
  }

  async createSection(
    application: Application,
    sectionDto: SectionDto,
  ): Promise<Section> {
    return this.sectionService.save(
      await this.sectionService.create(sectionDto, application),
    );
  }

  async updateSection(
    application: Application,
    sectionDto: SectionDto,
    sectionAlias: string,
  ): Promise<Section> {
    return this.sectionService.save(
      await this.sectionService.update(
        await this.sectionService.findByAliasOrFail(
          application.companyId,
          sectionAlias,
        ),
        application,
        sectionDto,
      ),
    );
  }

  async getSection(
    application: Application,
    sectionAlias: string,
    query?: QueryPaginationInterface,
  ): Promise<Section> {
    return this.sectionService.findByAliasOrFail(
      application.id,
      sectionAlias,
      query,
    );
  }

  getSections(
    application: Application,
    query: QueryPaginationInterface,
  ): Promise<ListResult<Section>> {
    return this.sectionService.findInList(application.id, query);
  }

  async deleteSection(
    application: Application,
    sectionAlias: string,
  ): Promise<Section> {
    return await this.sectionService.save(
      this.sectionService.delete(
        await this.sectionService.findByAliasOrFail(
          application.id,
          sectionAlias,
        ),
      ),
    );
  }

  async createWhiteLabel(
    application: Application,
    whiteLabelDto: WhiteLabelDto,
  ): Promise<WhiteLabel> {
    return await this.whiteLabelService.save(
      await this.whiteLabelService.create(whiteLabelDto, application),
    );
  }

  async updateWhiteLabel(
    application: Application,
    whiteLabelDto: WhiteLabelDto,
    whiteLabelAlias: string,
  ): Promise<WhiteLabel> {
    return await this.whiteLabelService.save(
      await this.whiteLabelService.update(
        await this.whiteLabelService.findByAliasOrFail(
          application.companyId,
          whiteLabelAlias,
        ),
        application,
        whiteLabelDto,
      ),
    );
  }

  async getWhiteLabel(
    application: Application,
    whiteLabelAlias: string,
    query?: QueryPaginationInterface,
  ): Promise<WhiteLabel> {
    return this.whiteLabelService.findByAliasOrFail(
      application.id,
      whiteLabelAlias,
      query,
    );
  }

  async getWhiteLabels(
    application: Application,
    query: QueryPaginationInterface,
  ): Promise<ListResult<WhiteLabel>> {
    return await this.whiteLabelService.findInList(application.id, query);
  }

  async deleteWhiteLabel(
    application: Application,
    whiteLabelAlias: string,
  ): Promise<WhiteLabel> {
    return await this.whiteLabelService.save(
      this.whiteLabelService.delete(
        await this.whiteLabelService.findByAliasOrFail(
          application.id,
          whiteLabelAlias,
        ),
      ),
    );
  }

  async getTranslationKey(
    application: Application,
    translationKeyAlias: string,
    query?: QueryPaginationInterface,
  ): Promise<TranslationKey> {
    return await this.translationKeyService.getByAliasOrFail(
      application.id,
      translationKeyAlias,
      query,
    );
  }

  async getTranslationKeys(
    application: Application,
    query: QueryPaginationInterface,
  ): Promise<ListResult<TranslationKey>> {
    return await this.translationKeyService.findInList(application.id, query);
  }

  async deleteTranslationKey(
    application: Application,
    translationKeyAlias: string,
  ): Promise<TranslationKey> {
    return await this.translationKeyService.save(
      this.translationKeyService.delete(
        await this.translationKeyService.getByAliasOrFail(
          application.id,
          translationKeyAlias,
        ),
      ),
    );
  }

  async addTranslationToWhiteLabel(
    user: User,
    application: Application,
    whiteLabelAlias: string,
    whiteLabelTranslationDto: WhiteLabelTranslationDto,
  ): Promise<WhiteLabelTranslation> {
    return await this.whiteLabelService.createWhiteLabelTranslation(
      user,
      await this.whiteLabelService.findByAliasOrFail(
        application.id,
        whiteLabelAlias,
      ),
      whiteLabelTranslationDto,
    );
  }

  async activeWhiteLabel(
    application: Application,
    whiteLabelAlias: string,
    activeWhiteLabelDto: ActiveWhiteLabelDto,
  ): Promise<WhiteLabel> {
    return await this.whiteLabelService.save(
      this.whiteLabelService.active(
        await this.whiteLabelService.findByAliasOrFail(
          application.id,
          whiteLabelAlias,
        ),
        activeWhiteLabelDto,
      ),
    );
  }

  async createTranslation(
    user: User,
    application: Application,
    translationDto: TranslationDto,
  ): Promise<Translation> {
    return await this.translationService.persist(
      user,
      application,
      translationDto,
    );
  }

  async addLanguages(
    application: Application,
    addLanguageToApplicationDto: LanguageToApplicationDto,
  ): Promise<Application> {
    const languagesList = this.languageService.indexBy(
      'id',
      await this.languageService.getByCodes(
        addLanguageToApplicationDto.languagesCode,
      ),
    );

    const queryRunner = this.queryRunnerProvider.createQueryRunner();
    await queryRunner.startTransaction();

    const addLanguagesTask = [];

    try {
      for (const index of Object.keys(languagesList)) {
        addLanguagesTask.push(
          (this.repository as ApplicationRepository).assignLanguage(
            application,
            languagesList[index],
            queryRunner.manager,
          ),
        );
      }

      await Promise.all(addLanguagesTask);

      await queryRunner.commitTransaction();
      application.languages = Object.keys(languagesList).map(
        index => languagesList[index],
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `'${languagesList[e.parameters[1]].code}' is already assigned to ${application.alias}`,
        );
      }

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    return application;
  }

  async removeLanguages(
    application: Application,
    addLanguageToApplicationDto: LanguageToApplicationDto,
  ) {
    const languagesList = await this.languageService.getByCodes(
      addLanguageToApplicationDto.languagesCode,
    );

    const removeLanguageTask = [];

    for (const language of languagesList) {
      removeLanguageTask.push(
        (this.repository as ApplicationRepository).removeLanguage(
          application,
          language,
        ),
      );
    }

    await Promise.all(removeLanguageTask);

    return application;
  }

  async getTranslations(
    application: Application,
    languageCode: string,
    query?: QueryPaginationInterface
  ): Promise<ListResult<Translation>> {
    const language = await this.languageService.getByCodeInApplication(application.id, languageCode);
   return await this.translationService.findInList(application.id, language.id, query);
  }

  protected async getIncludes(
    companyId: number,
    application: Application,
    query: QueryPaginationInterface,
  ): Promise<Application> {
    if (!query || !query.includes) {
      return application;
    }

    if (query.includes.includes('languages')) {
      application.languages = await this.languageService.getByApplication(
        companyId,
        application.id,
        {},
      );
    }

    if (query.includes.includes('sections')) {
      application.sections = await this.sectionService.getByApplication(
        companyId,
        application.id,
        {},
      );
    }

    if (query.includes.includes('white-labels')) {
      application.whiteLabels = await this.whiteLabelService.getByApplication(
        companyId,
        application.id,
        {},
      );
    }

    return application;
  }
}
