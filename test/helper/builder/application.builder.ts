import { Application } from '../../../src/Entities/application.entity';

export const buildApplication = (applicationData?: any): Application => {
  applicationData = applicationData || {};
  const application = new Application();
  application.id = applicationData.id || 1;
  application.alias = applicationData.alias || 'application_alias_1';
  application.name = applicationData.name || 'application name_1';
  application.isActive = applicationData.isActive !== undefined ? applicationData.isActive : true;
  application.deletedAt = applicationData.deletedAt || 0;
  application.languages = applicationData.languages || [];
  application.companyId = applicationData.companyId || 1;
  return application;
};

export const buildApplicationArray = () =>
  [1, 2, 3, 4, 5].map(index => buildApplication({
    id: index,
    alias: 'application_alias_' + index,
    name: 'application name_' + index,
  }));
