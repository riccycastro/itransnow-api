export interface QueryPaginationInterface {
  [k: string]: string | string[];
}

export type OrderDirection = 'ASC' | 'DESC';

export enum OrderDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class RepositoryCore<Entity> {}
