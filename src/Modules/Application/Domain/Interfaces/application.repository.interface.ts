import { SaveOptions } from 'typeorm';
import { Application } from '../Entities/application.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';

export interface ApplicationRepositoryInterface {
  save<T extends DeepPartial<Application>>(
    entity: T[] | T,
    options?: SaveOptions,
  ): Promise<T & Application> | Promise<T[]> | Promise<(T & Application)[]>;

  findOneByAlias(alias?: string): Promise<Application | undefined>;

  findList(): Promise<[Application[], number]>;
}
