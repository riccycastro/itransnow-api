import { EntityRepository, Repository } from 'typeorm';
import { Company } from '../Entities/company.entity';

@EntityRepository(Company)
export class CompanyRepository extends Repository<Company> {}
