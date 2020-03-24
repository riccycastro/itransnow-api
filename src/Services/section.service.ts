import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AbstractEntityService } from './AbstractEntityService';
import { Section } from '../Entities/section.entity';
import { SectionRepository } from '../Repositories/section.repository';
import { ActiveSectionDto, SectionDto } from '../Dto/section.dto';
import { Application } from '../Entities/application.entity';
import { remove as removeDiacritics } from 'diacritics';
import { ApplicationService } from './application.service';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';
import { TranslationKeyToSectionDto } from '../Dto/translation-key.dto';
import { TranslationKeyService } from './translation-key.service';
import { Connection } from 'typeorm';

export enum SectionIncludesEnum {
  application = 'application',
  translationKeys = 'translationKeys',
}

@Injectable()
export class SectionService extends AbstractEntityService<Section> {

  private readonly applicationService: ApplicationService;
  private readonly translationKeyService: TranslationKeyService;
  private readonly connection: Connection;

  constructor(
    sectionRepository: SectionRepository,
    @Inject(forwardRef(() => ApplicationService))
      applicationService: ApplicationService,
    translationKeyService: TranslationKeyService,
    connection: Connection,
  ) {
    super(sectionRepository);
    this.applicationService = applicationService;
    this.translationKeyService = translationKeyService;
    this.connection = connection;
  }

  async findByAlias(companyId: number, alias: string, query?: any): Promise<Section> {
    const section = await (this.repository as SectionRepository).findByAlias(companyId, alias);

    if (!section) {
      throw new NotFoundException('Section not found!');
    }

    return await this.getIncludes(companyId, section, query);
  }

  async findByApplication(companyId: number, applicationId: number, query: QueryPaginationInterface): Promise<Section[]> {
    return await (this.repository as SectionRepository).findByApplication(companyId, applicationId, query);
  }

  async findInList(companyId: number, query?: QueryPaginationInterface): Promise<Section[]> {
    const sections = await (this.repository as SectionRepository).findInList(companyId, query);

    for (const sectionsKey in sections) {
      sections[sectionsKey] = await this.getIncludes(companyId, sections[sectionsKey], query);
    }
    return sections;
  }

  async create(sectionDto: SectionDto, application: Application): Promise<Section> {

    const sectionAlias = removeDiacritics(sectionDto.alias.trim().replace(/ /g, '_')).toLowerCase();

    if (await this.repository.findOne({ alias: sectionAlias, application: application })) {
      throw new BadRequestException(`Section with alias "${sectionDto.alias}" already exists in ${application.name} application`);
    }

    const sectionEntity = new Section();
    sectionEntity.name = sectionDto.name;
    sectionEntity.alias = sectionAlias;
    sectionEntity.application = application;
    return sectionEntity;
  }

  delete(section: Section): Section {
    section.isDeleted = true;
    return section;
  }

  active(section: Section, activeSectionDto: ActiveSectionDto): Section {
    section.isActive = activeSectionDto.isActive;
    return section;
  }

  async update(section: Section, sectionDto: SectionDto): Promise<Section> {
    section.name = sectionDto.name;
    section.alias = sectionDto.alias ?? section.alias;
    return await this.save(section);
  }

  async addTranslationKeys(companyId: number, section: Section, addTranslationKeyToSectionDto: TranslationKeyToSectionDto): Promise<Section> {
    const translationKeys = this.translationKeyService.indexBy(
      'id',
      await this.translationKeyService.getByTranslationKeys(companyId, addTranslationKeyToSectionDto.translationKeys),
    );

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    const addTranslationKeysTask = [];

    try {
      for (const index of Object.keys(translationKeys)) {
        addTranslationKeysTask.push((this.repository as SectionRepository).insertTranslationKey(section, translationKeys[index], queryRunner.manager));
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
      section.application = await this.applicationService.findById(section.applicationId);
    }

    if (query.includes.includes('translationKeys')) {

    }

    return section;
  }
}
