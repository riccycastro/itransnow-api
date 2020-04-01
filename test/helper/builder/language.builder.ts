import { Language } from '../../../src/Entities/language.entity';
import { utc } from 'moment';

export const buildLanguage = (index): Language => {
  const language = new Language();
  language.id = index;
  language.code = 'code_' + index;
  language.isActive = true;
  language.deletedAt = utc().unix();
  return language;
};

export const buildLanguageWithId1 = () => buildLanguage(1);
