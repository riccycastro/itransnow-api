import { TranslationKey } from '../../../src/Entities/translation-key.entity';

export const buildTranslationKey = (index: number): TranslationKey => {
  const translationKey = new TranslationKey();
  translationKey.id = index;
  translationKey.alias = 'translation_key_alias_' + index;
  translationKey.isActive = true;
  translationKey.deletedAt = 0;
  return translationKey;
};

export const buildTranslationKeyWithId1 = () => buildTranslationKey(1);
export const buildTranslationKeyArray = () => [1, 2, 3, 4, 5].map(index => buildTranslationKey(index));
