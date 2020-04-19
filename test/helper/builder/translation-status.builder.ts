import { TranslationStatus } from '../../../src/Entities/translation-status.entity';

export const buildTranslationStatus = (index: number): TranslationStatus => {
  const translationStatus = new TranslationStatus();
  translationStatus.id = index;
  translationStatus.status = 'status_' + index;

  return translationStatus;
};

export const buildTranslationStatusWithId1 = () => buildTranslationStatus(1);
