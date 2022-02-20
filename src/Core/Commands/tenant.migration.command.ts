import { Connection, createConnection, Migration } from 'typeorm';
import { Tenant } from '../Tenant/tenant.entity';
import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { createTenantOrmConfig } from '../Tenant/orm.config';

const MIGRATE_ALL = 'migrate-all';

interface MigrationsHistory {
  [tenantName: string]: Migration[];
}

@Injectable()
export class TenantMigrationCommand {
  constructor(private readonly connection: Connection) {}

  @Command({
    command: 'tenant:migration:run <tenantName>',
    describe: 'Run migrations for commands',
  })
  async runMigration(
    @Positional({
      name: 'tenantCode',
      describe: 'Define if you want to run in a single tenant or all tenants',
      type: 'string',
      default: MIGRATE_ALL,
      demandOption: false,
    })
    tenantCode: string,
  ) {
    if (tenantCode !== MIGRATE_ALL) {
      await this.migrate(tenantCode);
      process.exit(0);
    }

    const tenants: Tenant[] = await this.connection
      .getRepository(Tenant)
      .find({ where: { isActive: true, deletedAt: 0 } });

    const migrationHistory: MigrationsHistory = {};

    try {
      for (const tenant of tenants) {
        migrationHistory[tenant.name] = await this.migrate(tenant.code);
      }
      process.exit(0);
    } catch (err) {
      await this.undoMigrations(migrationHistory);
      console.error(err);
      process.exit(1);
    }
  }

  private async migrate(tenantCode: string): Promise<Migration[]> {
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('Migrating: ', tenantCode);
    const connected = await this.getTenantConnection(tenantCode);
    const migrations = await connected.runMigrations();
    await connected.close();
    console.log('Finished Migrating: ', tenantCode, ': ', migrations.length);
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    return migrations;
  }

  private async undoMigrations(migrationHistory: MigrationsHistory) {
    console.log('----------------------------------------------------------');
    for (const tenantCode of Object.keys(migrationHistory)) {
      console.log(
        'Undo migration: ',
        tenantCode,
        migrationHistory[tenantCode].length,
      );
      const connected = await this.getTenantConnection(tenantCode);
      const queryRunner = connected.createQueryRunner();

      await Promise.all(
        migrationHistory[tenantCode].map((migration: Migration) => {
          migration.instance.down(queryRunner);
        }),
      );
    }
    console.log('----------------------------------------------------------');
  }

  private async getTenantConnection(tenantCode: string): Promise<Connection> {
    console.log('Connecting to '+tenantCode)
    return createConnection(createTenantOrmConfig(tenantCode));
  }
}
