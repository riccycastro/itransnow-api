import { EntityManager, ObjectLiteral, Repository } from 'typeorm';

export abstract class AbstractEntityService {
  protected readonly repository: Repository<ObjectLiteral>;

  protected constructor(repository: Repository<ObjectLiteral>) {
    this.repository = repository;
  }

  async save<Entity>(entity: Entity, entityManager: EntityManager = null): Promise<Entity> {
    if (entityManager) {
      return await entityManager.save(entity);
    }

    return await this.repository.save(entity);
  }
}
