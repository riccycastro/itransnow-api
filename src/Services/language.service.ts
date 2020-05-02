import { AbstractEntityService } from './AbstractEntityService';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageRepository } from '../Repositories/language.repository';
import { Language } from '../Entities/language.entity';
import { In } from 'typeorm';
import { StringIndexedByString } from '../Types/type';

@Injectable()
export class LanguageService extends AbstractEntityService<Language> {
  constructor(languageRepository: LanguageRepository) {
    super(languageRepository);
  }

  async getByApplication(
    companyId: number,
    applicationId: number,
    query: StringIndexedByString,
  ): Promise<Language[]> {
    return (this.repository as LanguageRepository).findByApplication(
      companyId,
      applicationId,
      query,
    );
  }

  async getByCodes(codes: string[]): Promise<Language[]> {
    return await (this.repository as LanguageRepository).find({
      where: { code: In(codes), isActive: true, deletedAt: 0 },
    });
  }

  async getByCodeInApplication(
    applicationId: number,
    code: string,
  ): Promise<Language> {
    const language = await (this
      .repository as LanguageRepository).findByCodeInApplication(
      applicationId,
      code,
    );

    if (!language) {
      throw new NotFoundException('Language not found!');
    }

    return language;
  }
}
