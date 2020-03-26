import { WhiteLabel } from '../../../src/Entities/white-label.entity';
import { buildApplication } from './application.builder';

export const buildWhitelabel = (index: number) => {
  const whiteLabel = new WhiteLabel();
  whiteLabel.id = index;
  whiteLabel.name = 'white_label_name_' + index;
  whiteLabel.alias = 'white_label_alias_' + index;
  whiteLabel.isActive = true;
  whiteLabel.isDeleted = false;
  return whiteLabel;
};

export const buildWhiteLabelWithApplication = (whiteLabelIndex: number, applicationIndex: number) => {
  const whiteLabel = buildWhitelabel(whiteLabelIndex);
  whiteLabel.application = buildApplication(applicationIndex);
  return whiteLabel;
};
