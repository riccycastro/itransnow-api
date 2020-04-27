import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../Repositories/company.repository';
import { Company } from '../Entities/company.entity';
import { AbstractEntityService } from './AbstractEntityService';
import { StringProvider } from './Provider/string.provider';

@Injectable()
export class CompanyService extends AbstractEntityService<Company> {

  constructor(
    companyRepository: CompanyRepository,
    private readonly stringProvider: StringProvider,
  ) {
    super(companyRepository);
  }

  async getById(companyId: number): Promise<Company | undefined> {
    return await this.repository.findOne(companyId);
  }

  create(name: string): Company {
    const company = new Company();
    company.name = name;
    company.alias = this.stringProvider.removeDiacritics(name);
    return company;
  }
}
