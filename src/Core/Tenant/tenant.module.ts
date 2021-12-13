import {
  BadRequestException,
  Global,
  MiddlewareConsumer,
  Module,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Connection,
  createConnection,
  getConnection,
  getConnectionManager,
} from 'typeorm';

import { Tenant } from './tenant.entity';
import { Request, Response } from 'express';
import { createTenantOrmConfig } from './orm.config';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [
    {
      provide: TENANT_CONNECTION,
      inject: [REQUEST],
      scope: Scope.REQUEST,
      useFactory: async (request): Promise<Connection> => {
        return getConnection(request.subdomains[0]);
      },
    },
  ],
  exports: [TENANT_CONNECTION],
})
export class TenantModule {
  constructor(private readonly connection: Connection) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req: Request, res: Response, next) => {
        const tenant: Tenant = await this.connection
          .getRepository(Tenant)
          .findOne({ where: { code: req.subdomains[0] } });

        if (!tenant) {
          throw new BadRequestException(
            'Database Connection Error',
            'There is a Error with the Database!',
          );
        }

        if (getConnectionManager().has(tenant.code)) {
          next();
        } else {
          const createdConnection: Connection = await createConnection(
            createTenantOrmConfig(tenant.code),
          );

          if (createdConnection) {
            next();
          } else {
            throw new BadRequestException(
              'Database Connection Error',
              'There is a Error with the Database!',
            );
          }
        }
      })
      .forRoutes('*');
  }
}
