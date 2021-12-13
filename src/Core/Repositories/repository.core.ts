import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Repository } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { ObjectID } from 'typeorm/driver/mongodb/typings';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { SaveOptions } from 'typeorm/repository/SaveOptions';

export interface QueryPaginationInterface {
  [k: string]: string | string[];
}

export type OrderDirection = 'ASC' | 'DESC';

export enum OrderDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class RepositoryCore<Entity> {
  constructor(protected readonly repository: Repository<Entity>) {}

  find(
    options?: FindManyOptions<Entity> | FindConditions<Entity>,
  ): Promise<Entity[]> {
    return this.repository.find(options);
  }

  findOne(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity | undefined> {
    return this.repository.findOne(id, options);
  }

  save<T extends DeepPartial<Entity>>(
    entity: T | T[],
    options?: SaveOptions,
  ): Promise<T & Entity> | Promise<T[]> | Promise<(T & Entity)[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.repository.save(entity, options);
  }
}
