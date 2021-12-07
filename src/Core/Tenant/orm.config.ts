import { ConnectionOptions } from 'typeorm';

export const createTenantOrmConfig = (
  tenantCode: string,
): ConnectionOptions => {
  return {
    name: tenantCode,
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'itransnow_' + tenantCode,
    synchronize: false,
    migrations: ['dist/migrations/tenant/*{.ts,.js}'],
    cli: { migrationsDir: 'migrations/tenant' },
    entities: ['dist/**/*.entity{.ts,.js}'],
  };
};
