import { WhiteLabel } from '../../../src/Entities/white-label.entity';
import { buildApplication } from './application.builder';
import { utc } from 'moment';

export const buildWhitelabel = (index: number) => {
  const whiteLabel = new WhiteLabel();
  whiteLabel.id = index;
  whiteLabel.name = 'white_label_name_' + index;
  whiteLabel.alias = 'white_label_alias_' + index;
  whiteLabel.isActive = true;
  whiteLabel.deletedAt = utc().unix();
  return whiteLabel;
};

export const buildWhiteLabelWithApplication = (whiteLabelIndex: number, applicationIndex: number) => {
  const whiteLabel = buildWhitelabel(whiteLabelIndex);
  whiteLabel.application = buildApplication(applicationIndex);
  return whiteLabel;
};

export const buildWhiteLabelWithId1 = () => buildWhitelabel(1);
