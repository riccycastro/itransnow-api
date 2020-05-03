import { Company } from '../../../src/Entities/company.entity';

export const buildCompany = (companyData?: any): Company => {
  companyData = companyData || {};
  const company = new Company();
  company.id = companyData.id || 1;
  company.name = companyData.name || 'company_name1';
  company.alias = companyData.alias || 'company_alias1';
  company.isActive = companyData.isActive !== undefined ? companyData.isActive : true;
  company.deletedAt = companyData.deletedAt || 0;
  return company;
};
