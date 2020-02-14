import { ConflictException, Injectable } from '@nestjs/common';
import { AbstractEntityService } from './AbstractEntityService';
import { ApplicationRepository } from '../Repositories/application.repository';
import { CreateApplicationDto } from './Dto/CreateApplicationDto';
import { Application } from '../Entities/application.entity';
import { remove as removeDiacritics } from 'diacritics';

@Injectable()
export class ApplicationService extends AbstractEntityService {
  constructor(applicationRepository: ApplicationRepository) {
    super(applicationRepository);
  }

  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    createApplicationDto.alias = removeDiacritics(createApplicationDto.alias.trim().replace(/ /g, '_'));

    if (await this.findByAlias(createApplicationDto.alias)) {
      throw new ConflictException();
    }

    const applicationEntity = new Application();
    applicationEntity.name = createApplicationDto.name;
    applicationEntity.alias = createApplicationDto.alias;

    return await this.save(applicationEntity);
  }

  async findByAlias(alias: string) {
    return (this.repository as ApplicationRepository).findOne({ where: { alias: alias } });
  }
}
