import { AbstractEntityService } from './abstract-entity.service';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';
import { ListResult } from '../Types/type';
import { classToClass } from 'class-transformer';

export abstract class AbstractEntityListingService<
  Entity
> extends AbstractEntityService<Entity> {
  async findInList(
    companyId: number,
    query?: QueryPaginationInterface,
  ): Promise<ListResult<Entity>> {
    const listResult = await this.getEntityListAndCount(companyId, query);

    return {
      data: classToClass(listResult[0]),
      count: listResult[1],
    };
  }

  protected abstract async getEntityListAndCount(
    entityId: number,
    query?: QueryPaginationInterface,
  ): Promise<[Entity[], number]>;
}
