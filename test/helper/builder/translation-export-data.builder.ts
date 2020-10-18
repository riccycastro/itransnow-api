import { TranslationExportData } from '../../../src/Types/type';

export const buildTranslationExportData = (translationData?: any): TranslationExportData => {
  return {
    translation: translationData.translation || 'translation_translation_1',
    translationKey: translationData.translationKey,
    section: ''
  };
};

export const buildTranslationExportDataArray = () =>
  [1, 2, 3, 4, 5].map(index => buildTranslationExportData({
    id: index,
    translation: 'translation_translation_' + index,
    translationKey: 'translation_translationKey_' + index,
  }));

