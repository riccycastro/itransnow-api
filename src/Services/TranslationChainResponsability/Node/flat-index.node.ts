import { Translation } from '../../../Entities/translation.entity';

export class FlatIndexNode {
  apply(translations: Translation[]) {
    return translations.reduce(
      (previousData: any, translation: Translation) => {
        if (translation.translationKey.sections) {
          for (const section of translation.translationKey.sections) {
            previousData[section.alias] = previousData[section.alias]
              ? previousData[section.alias]
              : {};
            previousData[section.alias][translation.translationKey.alias] =
              translation.translation;
          }
        } else {
          previousData[translation.translationKey.alias] =
            translation.translation;
        }
        return previousData;
      },
      {},
    );
  }
}
