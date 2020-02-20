import { AbstractEntityService } from './AbstractEntityService';
import { Injectable } from '@nestjs/common';
import { LanguageRepository } from '../Repositories/language.repository';
import { Language } from '../Entities/language.entity';

@Injectable()
export class LanguageService extends AbstractEntityService {

  constructor(
    languageRepository: LanguageRepository,
  ) {
    super(languageRepository);
  }

  async findByApplication(companyId: number, applicationId: number): Promise<Language[]> {
    return (this.repository as LanguageRepository).findByApplication(
      companyId,
      applicationId,
      {}
    );
  }
}
