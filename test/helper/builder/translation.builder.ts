import { Translation } from '../../../src/Entities/translation.entity';

export const buildTranslation = (index: number) => {
  const translation = new Translation();
  translation.id = index;
  translation.translation = 'translation_translation_' + index;
  translation.isDeleted = false;
  return translation;
};
