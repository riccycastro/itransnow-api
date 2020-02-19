import { ConflictException, Injectable } from '@nestjs/common';
import { AbstractEntityService } from './AbstractEntityService';
import { ApplicationRepository } from '../Repositories/application.repository';
import { CreateApplicationDto } from '../Dto/CreateApplicationDto';
import { Application } from '../Entities/application.entity';
import { remove as removeDiacritics } from 'diacritics';
import { Company } from '../Entities/company.entity';

@Injectable()
export class ApplicationService extends AbstractEntityService {
  constructor(applicationRepository: ApplicationRepository) {
    super(applicationRepository);
  }

  async create(createApplicationDto: CreateApplicationDto, company: Company): Promise<Application> {
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

  async findById(company: Company, id: number) {
    return await (this.repository as ApplicationRepository).findOne({where: {id: id, company: company.id}});
  }

  async findByAlias(alias: string) {
    return (this.repository as ApplicationRepository).findOne({ where: { alias: alias } });
  }

  async findInList(company: Company, query: any): Promise<Application[]> {
    return await (this.repository as ApplicationRepository).findInList(company, query);
  }
}
