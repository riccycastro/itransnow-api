import { Application } from '../../../src/Entities/application.entity';
import { utc } from 'moment';

export const buildApplication = (index: number): Application => {
  const application = new Application();
  application.id = 1;
  application.alias = 'application_alias_' + index;
  application.name = 'application name_' + index;
  application.isActive = true;
  application.deletedAt = utc().unix();
  application.languages = [];
  return application;
};

export const buildApplicationWithId1 = (): Application => buildApplication(1);
export const buildApplicationArray = () =>
  [1, 2, 3, 4, 5].map(index => buildApplication(index));
