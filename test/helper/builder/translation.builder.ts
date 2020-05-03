import { Translation } from '../../../src/Entities/translation.entity';
import { buildTranslationKey } from './translation-key.build';

export const buildTranslation = (translationData?: any): Translation => {
  translationData = translationData || {};

  const translation = new Translation();
  translation.id = translationData.id || 1;
  translation.translation = translationData.translation || 'translation_translation_1';
  translation.deletedAt = translationData.deletedAt || 0;
  translation.translationKey = translationData.translationKey;
  return translation;
};

export const buildTranslationArray = () =>
  [1, 2, 3, 4, 5].map(index => buildTranslation({
    id: index,
    translation: 'translation_translation_' + index,
  }));

export const buildTranslationArrayWhitTranslationKey = () =>
  [1, 2, 3, 4, 5].map(index => buildTranslation({
    id: index,
    translation: 'translation_translation_' + index,
    translationKey: buildTranslationKey({
      id: index,
      alias: 'translation_key_alias_' + index,
    }),
  }));
