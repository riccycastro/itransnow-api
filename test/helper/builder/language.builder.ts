import { Language } from '../../../src/Entities/language.entity';

export const buildLanguage = (languageData?: any): Language => {
  languageData = languageData || {};
  const language = new Language();
  language.id = languageData.id || 1;
  language.code = languageData.code || 'code_1';
  language.isActive = languageData.isActive !== undefined ? languageData.isActive : true;
  language.deletedAt = languageData.deletedAt || 0;
  return language;
};

export const buildLanguageArray = () =>
  [1, 2, 3, 4, 5].map(index => buildLanguage({
    id: index,
    code: 'code_' + index,
  }));
