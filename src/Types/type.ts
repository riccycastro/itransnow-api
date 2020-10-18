import { EntityManager } from 'typeorm/entity-manager/EntityManager';

export interface StringIndexedByString {
  [k: string]: string;
}

export interface ListResult<Entity> {
  data: Entity[];
  count: number;
}

export interface QueryRunner {
  readonly manager: EntityManager;
  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  release(): Promise<void>;
}

export interface TranslationExportData {
  translation: string;
  translation_key: string;
  section: string;
}
