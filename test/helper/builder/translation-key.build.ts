import { TranslationKey } from '../../../src/Entities/translation-key.entity';

export const buildTranslationKey = (translationKeyData?: any): TranslationKey => {
  translationKeyData = translationKeyData || {};
  const translationKey = new TranslationKey();
  translationKey.id = translationKeyData.id || 1;
  translationKey.alias = translationKeyData.alias || 'translation_key_alias_1';
  translationKey.isActive = translationKeyData.isActive !== undefined ? translationKeyData.isActive : true;
  translationKey.deletedAt = translationKeyData.isDeletedAt || 0;
  return translationKey;
};

export const buildTranslationKeyArray = () =>
  [1, 2, 3, 4, 5].map(index => buildTranslationKey({
    id: index,
    alias: 'translation_key_alias_' + index,
  }));
