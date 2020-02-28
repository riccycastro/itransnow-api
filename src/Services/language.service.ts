import {AbstractEntityService} from './AbstractEntityService';
import {Injectable, NotFoundException} from '@nestjs/common';
import {LanguageRepository} from '../Repositories/language.repository';
import {Language} from '../Entities/language.entity';
import {QueryPaginationInterface} from '../Repositories/abstract.repository';
import {In} from 'typeorm';

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

  async findByCodes(codes: string[], indexBy?: string): Promise<{ [p: string]: Language } | Language[]> {
    const languages = await (this.repository as LanguageRepository).find({where: {code: In(codes)}});
    if (indexBy) {
      return this.indexBy(languages, 'code');
    }

    return languages;
  }

  async findByCode(companyId: number, code: string): Promise<Language> {
    console.log(companyId, code)
    const language = await (this.repository as LanguageRepository).findByCode(companyId, code);

    if (!language) {
      throw new NotFoundException("Language not found!");
    }

    return language;
  }
}
