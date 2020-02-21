import { Repository, SelectQueryBuilder } from 'typeorm';

export interface QueryPaginationInterface {
  offset?: number;
  limit?: number;
  search?: { [k: string]: string };
  orderField?: string;
  orderDirection?: OrderDirection;
}

export type OrderDirection = 'ASC' | 'DESC';

export class AbstractRepository<Entity> extends Repository<Entity> {
  private isQueryInitialized = false;
  private initQuery(query: QueryPaginationInterface) {
    if (!this.isQueryInitialized) {
      query.offset = query.offset ?? 0;
      query.limit = query.limit ?? 10;
      query.search = query.search ?? {};
      query.orderDirection = query.orderDirection ?? 'ASC';
    }
  }

  protected setLimit(queryBuilder: SelectQueryBuilder<Entity>, query: QueryPaginationInterface): SelectQueryBuilder<Entity> {
    this.initQuery(query);

    return queryBuilder
      .limit(query.limit)
      .offset(query.offset);
  }

  protected setOrderBy(queryBuilder: SelectQueryBuilder<Entity>, query: QueryPaginationInterface): SelectQueryBuilder<Entity> {
    this.initQuery(query);
    if (!query.orderField) {
      return queryBuilder;
    }
    return queryBuilder
      .orderBy(query.orderField, query.orderDirection);
  }

  protected setPagination(queryBuilder: SelectQueryBuilder<Entity>, query: QueryPaginationInterface): SelectQueryBuilder<Entity> {
    this.initQuery(query);
    queryBuilder = this.setLimit(queryBuilder, query);
    return this.setOrderBy(queryBuilder, query);
  }
}
