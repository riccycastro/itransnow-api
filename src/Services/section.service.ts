import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Section } from '../Entities/section.entity';
import { SectionRepository } from '../Repositories/section.repository';
import { ActiveSectionDto, SectionDto } from '../Dto/section.dto';
import { Application } from '../Entities/application.entity';
import { remove as removeDiacritics } from 'diacritics';
import { ApplicationService } from './application.service';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';
import { TranslationKeyToSectionDto } from '../Dto/translation-key.dto';
import { TranslationKeyService } from './translation-key.service';
import { AbstractEntityListingService } from './AbstractEntityListingService';
import { MomentProvider } from './Provider/moment.provider';
import { QueryRunnerProvider } from './Provider/query-runner.provider';

export enum SectionIncludesEnum {
  application = 'application',
  translationKeys = 'translationKeys',
}

@Injectable()
export class SectionService extends AbstractEntityListingService<Section> {

  private readonly applicationService: ApplicationService;
  private readonly translationKeyService: TranslationKeyService;

  constructor(
    sectionRepository: SectionRepository,
    @Inject(forwardRef(() => ApplicationService))
      applicationService: ApplicationService,
    translationKeyService: TranslationKeyService,
    private readonly queryRunnerProvider: QueryRunnerProvider,
    private readonly momentProvider: MomentProvider,
  ) {
    super(sectionRepository);
    this.applicationService = applicationService;
    this.translationKeyService = translationKeyService;
  }

  async findByAliasOrFail(companyId: number, alias: string, query?: any): Promise<Section> {
    const section = await this.findByAlias(companyId, alias);

    if (!section) {
      throw new NotFoundException('Section not found!');
    }

    return await this.getIncludes(companyId, section, query);
  }

  private async findByAlias(companyId: number, alias: string): Promise<Section> {
    return await (this.repository as SectionRepository).findByAlias(companyId, alias);
  }

  async getByApplication(companyId: number, applicationId: number, query: QueryPaginationInterface): Promise<Section[]> {
    return await (this.repository as SectionRepository).findByApplication(companyId, applicationId, query);
  }

  protected async getEntityListAndCount(companyId: number, query?: QueryPaginationInterface): Promise<[Section[], number]> {
    const listResult = await (this.repository as SectionRepository).findInList(companyId, query);

    for (let section of listResult[0]) {
      section = await this.getIncludes(companyId, section, query);
    }

    return listResult;
  }

  async create(sectionDto: SectionDto, application: Application): Promise<Section> {

    const sectionAlias = removeDiacritics(sectionDto.alias.trim().replace(/ /g, '_')).toLowerCase();

    if (await this.repository.findOne({ alias: sectionAlias, application: application, deletedAt: 0 })) {
      throw new BadRequestException(`Section with alias "${sectionDto.alias}" already exists in ${application.name} application`);
    }

    const sectionEntity = new Section();
    sectionEntity.name = sectionDto.name;
    sectionEntity.alias = sectionAlias;
    sectionEntity.application = application;
    return sectionEntity;
  }

  delete(section: Section): Section {
    section.deletedAt = this.momentProvider.utc().unix();
    return section;
  }

  active(section: Section, activeSectionDto: ActiveSectionDto): Section {
    section.isActive = activeSectionDto.isActive;
    return section;
  }

  update(section: Section, sectionDto: SectionDto): Section {
    section.name = sectionDto.name;
    section.alias = sectionDto.alias ?
      removeDiacritics(sectionDto.alias.trim().replace(/ /g, '_')).toLowerCase() :
      section.alias;
    return section;
  }

  async addTranslationKeys(companyId: number, section: Section, addTranslationKeyToSectionDto: TranslationKeyToSectionDto): Promise<Section> {
    const translationKeys = this.translationKeyService.indexBy(
      'id',
      await this.translationKeyService.getByTranslationKeys(companyId, addTranslationKeyToSectionDto.translationKeys),
    );

    const queryRunner = this.queryRunnerProvider.createQueryRunner();
    await queryRunner.startTransaction();

    const addTranslationKeysTask = [];

    try {
      for (const index of Object.keys(translationKeys)) {
        addTranslationKeysTask.push((this.repository as SectionRepository).assignTranslationKey(section, translationKeys[index], queryRunner.manager));
      }
      await Promise.all(addTranslationKeysTask);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return section;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`'${translationKeys[e.parameters[1]].alias}' is already assigned to ${section.alias}`);
      }

      throw new InternalServerErrorException();
    }
  }

  async removeTranslationKeys(companyId: number, section: Section, removeTranslationKeyToSectionDto: TranslationKeyToSectionDto): Promise<Section> {
    const translationKeys = this.translationKeyService.indexBy(
      'id',
      await this.translationKeyService.getByTranslationKeys(companyId, removeTranslationKeyToSectionDto.translationKeys),
    );

    const removeTranslationKeysTask = [];

    for (const index of Object.keys(translationKeys)) {
      removeTranslationKeysTask.push((this.repository as SectionRepository).removeTranslationKey(section, translationKeys[index]));
    }

    await Promise.all(removeTranslationKeysTask);

    return section;
  }

  protected async getIncludes(companyId: number, section: Section, query: any): Promise<Section> {

    if (!query || !query.includes) {
      return section;
    }

    if (query.includes.includes('application')) {
      section.application = await this.applicationService.getById(section.applicationId);
    }

    if (query.includes.includes('translationKeys')) {

    }

    return section;
  }
}
