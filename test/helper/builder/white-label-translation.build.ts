import { WhiteLabelTranslation } from '../../../src/Entities/white-label-translation.entity';

export const buildWhiteLabelTranslation = (index): WhiteLabelTranslation => {
  const whiteLabelTranslation = new WhiteLabelTranslation();
  whiteLabelTranslation.id = index;
  return whiteLabelTranslation;
};
