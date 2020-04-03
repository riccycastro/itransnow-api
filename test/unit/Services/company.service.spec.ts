import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../../../src/Services/company.service';
import { CompanyRepository } from '../../../src/Repositories/company.repository';
import { Company } from '../../../src/Entities/company.entity';

describe('CompanyService', () => {
  let app: TestingModule;
  let companyService: CompanyService;
  let companyRepository: CompanyRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        CompanyService,
        CompanyRepository,
      ],
    }).compile();

    companyRepository = app.get<CompanyRepository>(CompanyRepository);
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
