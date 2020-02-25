import { AbstractEntityService } from './AbstractEntityService';
import { Injectable } from '@nestjs/common';
import { LanguageRepository } from '../Repositories/language.repository';
import { Language } from '../Entities/language.entity';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';

@Injectable()
export class LanguageService extends AbstractEntityService<Language> {

  constructor(
    languageRepository: LanguageRepository,
  ) {
    super(languageRepository);
  }

  async findByApplication(companyId: number, applicationId: number, query: QueryPaginationInterface): Promise<Language[]> {
    return (this.repository as LanguageRepository).findByApplication(
      companyId,
      applicationId,
      query
    );
  }

  protected getIncludes(companyId: number, entity: any, query: any): Promise<any> {
    return undefined;
  }
}
