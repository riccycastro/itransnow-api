import { TranslationDto } from '../../Dto/translation.dto';
import { TranslationStrategy } from '../Strategy/translation.strategy';
import { Injectable } from '@nestjs/common';
import { ApplicationService } from '../application.service';
import { LanguageService } from '../language.service';
import { TranslationService } from '../translation.service';

@Injectable()
export class TranslationStrategyProvider {

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly languageService: LanguageService,
    private readonly translationService: TranslationService,
  ) {
  }

  async getStrategy(companyId: number, translationDto: TranslationDto) {
    const application = await this.applicationService.findByAlias(companyId, translationDto.application);
    const language = await this.languageService.getByCodeInApplication(application.id, translationDto.language);

    if (this.validateValidFields(['language', 'application'], translationDto)) {
      return new TranslationStrategy(this.translationService, application.id, language.id);
    }
  }

  private validateValidFields(fields: string[], translationDto: TranslationDto): boolean {
    // deep clone without references
    const obj = JSON.parse(JSON.stringify(translationDto));
    const objKeys = Object.keys(obj);

    if (objKeys.length > fields.length) {
      return false;
    }

    for (const field of fields) {
      if (!objKeys.includes(field)) {
        return false;
      }
    }

    return true;
  }
}
