import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractEntityService } from './AbstractEntityService';
import { Section } from '../Entities/section.entity';
import { SectionRepository } from '../Repositories/section.repository';
import { SectionDto } from '../Dto/SectionDto';
import { Application } from '../Entities/application.entity';
import { remove as removeDiacritics } from 'diacritics';
import { ApplicationService } from './application.service';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';

@Injectable()
export class SectionService extends AbstractEntityService<Section> {

  private readonly applicationService: ApplicationService;

  constructor(
    sectionRepository: SectionRepository,
    @Inject(forwardRef(() => ApplicationService))
    applicationService: ApplicationService
  ) {
    super(sectionRepository);
    this.applicationService = applicationService;
  }

  async findByAlias(companyId: number, alias: string, query?: any): Promise<Section> {
    const section = await this.repository.findOne({
      where: {
        alias: alias,
        company: companyId,
        isDeleted: false,
      },
    });

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
    if (await this.repository.findOne({ alias: sectionDto.alias, application: application })) {
      throw new BadRequestException(`Section with alias "${sectionDto.alias}" already exists in ${application.name} application`);
    }

    const sectionEntity = new Section();
    sectionEntity.name = sectionDto.name;
    sectionEntity.alias = removeDiacritics(sectionDto.alias.trim().replace(/ /g, '_')).toLowerCase();
    sectionEntity.application = application;
    return sectionEntity;
  }

  async delete(section: Section) {
    section.isDeleted = true;
    this.save(section);
  }

  protected async getIncludes(companyId: number, section: Section, query: any): Promise<Section> {

    if (!query || !query.includes) {
      return section;
    }

    if (query.includes.includes('application')) {
      section.application = await this.applicationService.findById(section.applicationId)
    }

    return section;
  }
}
