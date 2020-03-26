import { Application } from '../../../src/Entities/application.entity';

export const buildApplication = (index: number): Application => {
  const application = new Application();
  application.id = 1;
  application.alias = 'application_test_' + index;
  application.name = 'Application Test_' + index;
  application.isActive = true;
  application.isDeleted = false;
  return application;
};

export const buildApplicationWithId1 = (): Application => {
  return buildApplication(1);
};
