import { Connection } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QueryRunner } from '../../Types/type';

@Injectable()
export class QueryRunnerProvider {
  constructor(
    private readonly connection: Connection,
  ) {
  }

  createQueryRunner(mode?: "master" | "slave"): QueryRunner {
    return this.connection.createQueryRunner(mode);
  }
}
