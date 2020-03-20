import { EntityRepository } from 'typeorm';
import { WhiteLabel } from '../Entities/white-label.entity';
import { AbstractRepository, QueryPaginationInterface } from './abstract.repository';
import { Section } from '../Entities/section.entity';

@EntityRepository(WhiteLabel)
export class WhiteLabelRepository extends AbstractRepository<WhiteLabel> {
  findByAlias(companyId: number, alias: string): Promise<WhiteLabel> {
    return this.createQueryBuilder('whiteLabel')
      .innerJoin('whiteLabel.application', 'application')
      .innerJoin('application.company', 'company')
      .where('company.id = :companyId', {companyId: companyId})
      .andWhere('whiteLabel.alias LIKE :alias', { alias: alias })
      .andWhere('whiteLabel.isDeleted = 0')
      .getOne();
  }

  async findByApplication(companyId: number, applicationId: number, query: QueryPaginationInterface): Promise<WhiteLabel[]> {
    const queryBuilder = this
      .createQueryBuilder('whiteLabels')
      .innerJoin('whiteLabels.application', 'application')
      .innerJoin('application.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('application.id = :applicationId', { applicationId: applicationId })
      .andWhere('whiteLabels.isDeleted = \'0\'');
    return await this.setPagination(queryBuilder, query, 'whiteLabels').getMany();
  }

  async findInList(companyId: number, query: QueryPaginationInterface): Promise<WhiteLabel[]> {
    let queryBuilder = this.createQueryBuilder('whiteLabels')
      .innerJoin('whiteLabels.application', 'application')
      .innerJoin('application.company', 'company')
      .where('company.id = :companyId', { companyId: companyId })
      .andWhere('whiteLabels.isDeleted = \'0\'');

    queryBuilder = this.queryName(queryBuilder, 'whiteLabels', query);
    queryBuilder = this.queryAlias(queryBuilder, 'whiteLabels', query);
    queryBuilder = this.queryActive(queryBuilder, 'whiteLabels', query);

    return await this.setPagination(queryBuilder, query, 'whiteLabels').getMany();
  }
}
