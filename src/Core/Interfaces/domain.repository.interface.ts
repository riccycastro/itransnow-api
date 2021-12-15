import { SaveOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ObjectID } from 'typeorm/driver/mongodb/typings';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindConditions } from 'typeorm/find-options/FindConditions';

export default interface DomainRepositoryInterface<Entity> {
  save<T extends DeepPartial<Entity>>(
    entity: T[] | T,
    options?: SaveOptions,
  ): Promise<T & Entity> | Promise<T[]> | Promise<(T & Entity)[]>;

  findOne(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity | undefined>;

  findAndCount(
    options?: FindManyOptions<Entity> | FindConditions<Entity>,
  ): Promise<[Entity[], number]>;
}
