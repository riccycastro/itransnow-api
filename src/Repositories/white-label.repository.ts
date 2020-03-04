import { EntityRepository, Repository } from 'typeorm';
import { WhiteLabel } from '../Entities/white-label.entity';

@EntityRepository(WhiteLabel)
export class WhiteLabelRepository extends Repository<WhiteLabel> {
  findByAlias(companyId: number, alias: string): Promise<WhiteLabel> {
    return this.createQueryBuilder('white_labels')
      .innerJoin('white_labels.application', 'application')
      .innerJoin('application.company', 'company')
      .where('company.id = :companyId', {companyId: companyId})
      .andWhere('white_labels.alias LIKE :alias', {alias: alias})
      .getOne();
  }
}
