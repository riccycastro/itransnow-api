import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../Repositories/company.repository';
import { Company } from '../Entities/company.entity';
import { remove as removeDiacritics } from 'diacritics';
import { AbstractEntityService } from './AbstractEntityService';

@Injectable()
export class CompanyService extends AbstractEntityService<Company> {

  constructor(companyRepository: CompanyRepository) {
    super(companyRepository);
  }

  async getById(companyId: number): Promise<Company | undefined> {
    return await this.repository.findOne(companyId);
  }

  create(name: string): Company {
    const company = new Company();
    company.name = name;
    company.alias = removeDiacritics(name.trim().replace(/ /g, '_')).toLowerCase();
    return company;
  }
}
