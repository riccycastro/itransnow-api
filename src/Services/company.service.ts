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

  create(name: string): Company {
    const company = new Company();
    company.name = name;
      company.alias = removeDiacritics(name.trim().replace(/ /g, '_'));
    return company;
  }

  async findById(id: number): Promise<Company> {
    return await this.repository.findOne(id) as Company;
  }
}
