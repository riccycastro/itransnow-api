import { ConflictException, Injectable } from '@nestjs/common';
import { AbstractEntityService } from './AbstractEntityService';
import { ApplicationRepository } from '../Repositories/application.repository';
import { ApplicationDto } from '../Dto/ApplicationDto';
import { Application } from '../Entities/application.entity';
import { remove as removeDiacritics } from 'diacritics';
import { Company } from '../Entities/company.entity';
import { LanguageService } from './language.service';

@Injectable()
export class ApplicationService extends AbstractEntityService {
  private readonly languageService: LanguageService;

  constructor(
    applicationRepository: ApplicationRepository,
    languageService: LanguageService,
  ) {
    super(applicationRepository);
    this.languageService = languageService;
  }

  async create(createApplicationDto: ApplicationDto, company: Company): Promise<Application> {
    createApplicationDto.alias = removeDiacritics(createApplicationDto.alias.trim().toLowerCase().replace(/ /g, '_'));

    if (await this.findByAlias(createApplicationDto.alias)) {
      throw new ConflictException();
    }

    const applicationEntity = new Application();
    applicationEntity.name = createApplicationDto.name;
    applicationEntity.alias = createApplicationDto.alias;
    applicationEntity.company = company;

    return await this.save(applicationEntity);
  }

  async findById(companyId: number, alias: string) {
    const application = await (this.repository as ApplicationRepository).findOne({
      where: {
        alias: alias,
        company: companyId,
        isDeleted: false,
      },
    });

    application.languages = await this.languageService.findByApplication(companyId, application.id);

    return application;
  }

  async findByAlias(alias: string) {
    return (this.repository as ApplicationRepository).findOne({ where: { alias: alias } });
  }

  async findInList(companyId: number, query: any): Promise<Application[]> {
    return await (this.repository as ApplicationRepository).findByCompany(companyId, query);
  }
}
