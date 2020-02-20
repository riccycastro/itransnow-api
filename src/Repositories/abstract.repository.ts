import { Repository, SelectQueryBuilder } from 'typeorm';

export interface QueryPaginationInterface {
  offset: number;
  limit: number;
  search: { [k: string]: string }
}

export class AbstractRepository<Entity> extends Repository<Entity> {
  private initQuery(query: QueryPaginationInterface) {
    query.offset = query.offset ?? 0;
    query.limit = query.limit ?? 10;
    query.search = query.search ?? {};
  }

  applyPagination(queryBuilder: SelectQueryBuilder<Entity>, query: QueryPaginationInterface): SelectQueryBuilder<Entity> {
    this.initQuery(query);

    queryBuilder
      .limit(query.limit)
      .offset(query.offset);

    return queryBuilder;
  }
}


