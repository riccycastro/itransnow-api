import { Translation } from '../../../src/Entities/translation.entity';
import { buildTranslationKey } from './translation-key.build';

export const buildTranslation = (index: number): Translation => {
  const translation = new Translation();
  translation.id = index;
  translation.translation = 'translation_translation_' + index;
  translation.deletedAt = 0;
  return translation;
};

export const buildTranslationWithTranslationKey = (
  index: number,
): Translation => {
  const translation = buildTranslation(index);
  translation.translationKey = buildTranslationKey(index);
  return translation;
};

export const buildTranslationWithId1 = () => buildTranslation(1);
export const buildTranslationArray = () =>
  [1, 2, 3, 4, 5].map(index => buildTranslation(index));
export const buildTranslationArrayWhitTranslationKey = () =>
  [1, 2, 3, 4, 5].map(index => buildTranslationWithTranslationKey(index));
