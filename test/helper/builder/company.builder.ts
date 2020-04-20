import { Company } from '../../../src/Entities/company.entity';

export const buildCompany = (index: number): Company => {
  const company = new Company();
  company.id = index;
  company.name = 'company_name' + index;
  company.alias = 'company_alias' + index;
  company.isActive = true;
  company.deletedAt = 0;
  return company;
};

export const buildCompanyWithId1 = () => buildCompany(1);
