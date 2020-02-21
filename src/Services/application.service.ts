import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractEntityService } from './AbstractEntityService';
import { ApplicationRepository } from '../Repositories/application.repository';
import { CreateApplicationDto } from '../Dto/ApplicationDto';
import { Application } from '../Entities/application.entity';
import { remove as removeDiacritics } from 'diacritics';
import { Company } from '../Entities/company.entity';
import { LanguageService } from './language.service';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';
import { User } from '../Entities/user.entity';

@Injectable()
export class ApplicationService extends AbstractEntityService<Application> {
  private readonly languageService: LanguageService;

  constructor(
    applicationRepository: ApplicationRepository,
    languageService: LanguageService,
  ) {
    super(applicationRepository);
    this.languageService = languageService;
  }

  async create(createApplicationDto: CreateApplicationDto, company: Company): Promise<Application> {
    createApplicationDto.alias = removeDiacritics(createApplicationDto.alias.trim().toLowerCase().replace(/ /g, '_'));

    if (await this.findByAlias(company.id, createApplicationDto.alias)) {
      throw new ConflictException();
    }

    const applicationEntity = new Application();
    applicationEntity.name = createApplicationDto.name;
    applicationEntity.alias = createApplicationDto.alias;
    applicationEntity.company = company;

    return await this.save(applicationEntity);
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

  async findInList(companyId: number, query?: any): Promise<Application[]> {
    const applications = await (this.repository as ApplicationRepository).findByCompany(companyId, query);

    for (const key in applications) {
      applications[key] = await this.getIncludes(companyId, applications[key], query);
    }

    return applications;
  }

  async delete(user: User, companyId: number, alias: string) {
    if (!user.isAdmin) {
      throw new ForbiddenException();
    }

    const application = await this.findByAlias(companyId, alias);

    if (!application) {
      return;
    }

    application.isDeleted = true;
    await this.repository.save(application);
  }

  private async getIncludes(companyId: number, application: Application, query: any): Promise<Application> {

    if (!query || !query.includes) {
      return application;
    }

    if (query.includes.includes('language')) {
      application.languages = await this.languageService.findByApplication(companyId, application.id, {});
    }

    return application;
  }

}
