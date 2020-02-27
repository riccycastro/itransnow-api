import { EntityManager, Repository } from 'typeorm';

export abstract class AbstractEntityService<Entity> {
  protected readonly repository: Repository<Entity>;

  protected constructor(repository: Repository<Entity>) {
    this.repository = repository;
  }

  async save<Entity>(entity: Entity, entityManager: EntityManager = null): Promise<Entity> {
    if (entityManager) {
      return await entityManager.save(entity);
    }

    return await this.repository.save(entity);
  }

  indexBy<Entity>(entities: Entity[], key: string): { [key: string]: Entity } {
    const indexObject: { [key: string]: Entity } = {};

    for (const entity of entities) {
      indexObject[entity[key]] = entity;
    }

    return indexObject;
  }

  protected abstract getIncludes(companyId: number, entity: any, query: any): Promise<any>
}
