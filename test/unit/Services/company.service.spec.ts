import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../../../src/Services/company.service';
import { CompanyRepository } from '../../../src/Repositories/company.repository';
import { Company } from '../../../src/Entities/company.entity';
import { StringProvider } from '../../../src/Services/Provider/string.provider';
import { buildCompanyWithId1 } from '../../helper/builder/company.builder';

describe('CompanyService', () => {
  let app: TestingModule;
  let companyService: CompanyService;
  let companyRepository: CompanyRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [CompanyService, CompanyRepository, StringProvider],
    }).compile();

    companyService = app.get<CompanyService>(CompanyService);
    companyRepository = app.get<CompanyRepository>(CompanyRepository);
  });

  describe('create', () => {
    it('should return a company', () => {
      const expectedResult = new Company();
      expectedResult.name = 'Company Name';
      expectedResult.alias = 'company_name';

      expect(companyService.create('Company Name')).toEqual(expectedResult);
    });
  });

  describe('getById', () => {
    it('should return a company', async () => {
      const findOneSpy = jest.spyOn(companyRepository, 'findOne').mockImplementation(async () => {
        return buildCompanyWithId1();
      });

      expect(await companyService.getById(1)).toEqual(buildCompanyWithId1());
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });
});
