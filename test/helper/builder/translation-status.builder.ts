import { TranslationStatus } from '../../../src/Entities/translation-status.entity';

export const buildTranslationStatus = (translationStatusData?: any): TranslationStatus => {
  translationStatusData = translationStatusData || {};

  const translationStatus = new TranslationStatus();
  translationStatus.id = translationStatusData.id || 1;
  translationStatus.status = translationStatusData.status || 'status_1';

  return translationStatus;
};
