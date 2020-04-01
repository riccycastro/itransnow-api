import { Translation } from '../../../src/Entities/translation.entity';
import { utc } from 'moment';

export const buildTranslation = (index: number) => {
  const translation = new Translation();
  translation.id = index;
  translation.translation = 'translation_translation_' + index;
  translation.deletedAt = utc().unix();
  return translation;
};
