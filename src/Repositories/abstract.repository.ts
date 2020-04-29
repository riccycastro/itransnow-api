import { Repository, SelectQueryBuilder } from 'typeorm';
import { StringIndexedByString } from '../Types/type';

export interface QueryPaginationInterface {
  [k: string]: string;
}

export type OrderDirection = 'ASC' | 'DESC';

export enum OrderDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class AbstractRepository<Entity> extends Repository<Entity> {
  private isQueryInitialized = false;

  private initQuery(query: StringIndexedByString) {
    if (!this.isQueryInitialized) {
      query.offset = query.offset || '0';
      query.limit = query.limit || '10';
      query.orderDirection = query.orderDirection || 'ASC';
    }
  }

  protected setLimit(
    queryBuilder: SelectQueryBuilder<Entity>,
    query: StringIndexedByString,
  ): SelectQueryBuilder<Entity> {
    this.initQuery(query);

    return queryBuilder.limit(Number(query.limit)).offset(Number(query.offset));
  }

  protected setOrderBy(
    queryBuilder: SelectQueryBuilder<Entity>,
    query: StringIndexedByString,
    tableName: string,
  ): SelectQueryBuilder<Entity> {
    this.initQuery(query);
    if (!query.orderField) {
      return queryBuilder;
    }
    return queryBuilder.orderBy(
      `${tableName}.${query.orderField}`,
      this.getOrderDirection(query.orderDirection),
    );
  }

  private getOrderDirection(orderDirection: string): OrderDirection {
    return orderDirection === 'DESC' ? 'DESC' : 'ASC';
  }

  protected setPagination(
    queryBuilder: SelectQueryBuilder<Entity>,
    query: StringIndexedByString,
    tableName: string,
  ): SelectQueryBuilder<Entity> {
    this.initQuery(query);
    queryBuilder = this.setLimit(queryBuilder, query);
    return this.setOrderBy(queryBuilder, query, tableName);
  }

  protected queryName(
    queryBuilder,
    tableName: string,
    search: any,
  ): SelectQueryBuilder<Entity> {
    if (search.name) {
      const names = search.name.split(',');
      queryBuilder = this.substringStatement(
        queryBuilder,
        tableName,
        'name',
        names,
      );
    }
    return queryBuilder;
  }

  protected queryAlias(
    queryBuilder,
    tableName: string,
    search: any,
  ): SelectQueryBuilder<Entity> {
    if (search.alias) {
      const alias = search.alias.split(',');
      queryBuilder = this.substringStatement(
        queryBuilder,
        tableName,
        'alias',
        alias,
      );
    }
    return queryBuilder;
  }

  protected queryActive(
    queryBuilder,
    tableName: string,
    search: any,
  ): SelectQueryBuilder<Entity> {
    if (search.active) {
      queryBuilder.andWhere(`${tableName}.isActive = :active`, {
        active: search.active,
      });
    }
    return queryBuilder;
  }

  private substringStatement(
    queryBuilder,
    tableName: string,
    columnName: string,
    values: string[],
  ): SelectQueryBuilder<Entity> {
    const parameters = {};
    const clauses = [];
    values.forEach((value, index) => {
      parameters[columnName + '_' + index] = '%' + value + '%';
      clauses.push(`${tableName}.${columnName} LIKE :${columnName}_${index}`);
    });
    return queryBuilder.andWhere('(' + clauses.join(' OR ') + ')', parameters);
  }
}
