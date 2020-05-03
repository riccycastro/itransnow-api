import { WhiteLabel } from '../../../src/Entities/white-label.entity';

export const buildWhitelabel = (whiteLabelData?: any) => {
  whiteLabelData = whiteLabelData || {};

  const whiteLabel = new WhiteLabel();
  whiteLabel.id = whiteLabelData.id || 1;
  whiteLabel.name = whiteLabelData.name || 'white_label_name_1';
  whiteLabel.alias = whiteLabelData.alias || 'white_label_alias_1';
  whiteLabel.isActive = whiteLabelData.isActive != undefined ? whiteLabelData.isActive : true;
  whiteLabel.deletedAt = whiteLabelData.deletedAt || 0;
  return whiteLabel;
};

export const buildWhiteLabelArray = () =>
  [1, 2, 3, 4, 5].map(index => buildWhitelabel({
    id: index,
    name: 'white_label_name_' + index,
    alias: 'white_label_alias_' + index,
  }));
