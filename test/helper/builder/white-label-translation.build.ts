import { WhiteLabelTranslation } from '../../../src/Entities/white-label-translation.entity';

export const buildWhiteLabelTranslation = (whiteLabelTranslationData?: any): WhiteLabelTranslation => {
  whiteLabelTranslationData = whiteLabelTranslationData || {};

  const whiteLabelTranslation = new WhiteLabelTranslation();
  whiteLabelTranslation.id = whiteLabelTranslationData.id || 1;
  return whiteLabelTranslation;
};
