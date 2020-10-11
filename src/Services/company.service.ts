import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from '../Repositories/company.repository';
import { Company } from '../Entities/company.entity';
import { AbstractEntityService } from './abstract-entity.service';
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

  async getByAliasOrFail(alias: string): Promise<Company> {
    const company = await this.getByAlias(alias);

    if (!company) {
      throw new NotFoundException(`Company ${alias} not found!`);
    }

    return company;
  }

  async getByAlias(alias: string): Promise<Company | undefined> {
    return this.repository.findOne({ alias, deletedAt: 0 });
  }

  create(name: string): Company {
    const company = new Company();
    company.name = name;
    company.alias = this.stringProvider.removeDiacritics(name);
    return company;
  }
}
