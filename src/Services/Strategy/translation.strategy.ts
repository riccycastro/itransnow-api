import { TranslationService } from '../translation.service';
import { Translation } from '../../Entities/translation.entity';

export class TranslationStrategy {
  private readonly translationService: TranslationService;
  private readonly applicationId: number;
  private readonly languageId: number;

  constructor(
    translationService: TranslationService,
    applicationId: number,
    languageId: number,
  ) {
    this.translationService = translationService;
    this.applicationId = applicationId;
    this.languageId = languageId;
  }

  async get() {
    return this.flatIndexByTranslationKey(
      await this.translationService.getTranslationInApplicationByLanguage(this.applicationId, this.languageId),
    );
  }

  private flatIndexByTranslationKey(translations: Translation[]) {

    return this.nestIndexByTranslationKey(translations);

    /*return translations.reduce((previousData: any, translation: Translation) => {
      previousData[translation.translationKey.alias] = translation.translation;
      return previousData;
    }, {});*/
  }

  private nestIndexByTranslationKey(translations: Translation[]) {
    const result = {};

    for (const translation of translations) {
      this.createNestedElement(translation.translationKey.alias, translation.translation, result);
    }
    return result;
  }

  private createNestedElement(key: string, data: string, obj: any) {

    const keyArray = key.split('.');

    if (keyArray.length === 1) {
      return obj[keyArray[0]] = data;
    }

    const currentKey = keyArray[0];

    keyArray.shift();

    return obj[keyArray[0]] = this.createNestedElement(keyArray.join('.'), data, obj);
  }
}
