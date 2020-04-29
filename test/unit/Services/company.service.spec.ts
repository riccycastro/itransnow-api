import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../../../src/Services/company.service';
import { CompanyRepository } from '../../../src/Repositories/company.repository';
import { Company } from '../../../src/Entities/company.entity';
import { StringProvider } from '../../../src/Services/Provider/string.provider';

describe('CompanyService', () => {
  let app: TestingModule;
  let companyService: CompanyService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [CompanyService, CompanyRepository, StringProvider],
    }).compile();

    companyService = app.get<CompanyService>(CompanyService);
  });

  describe('create', () => {
    it('should return a company', () => {
      const expectedResult = new Company();
      expectedResult.name = 'Company Name';
      expectedResult.alias = 'company_name';

      expect(companyService.create('Company Name')).toEqual(expectedResult);
    });
  });
});
