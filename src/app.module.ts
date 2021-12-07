import { Module } from '@nestjs/common';
import { AuthModule } from './Modules/Auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './Core/Filters/Exceptions/http-exception.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommandModule } from 'nestjs-command';
import { TenantMigrationCommand } from './Core/Commands/tenant.migration.command';
import { ApplicationModule } from './Modules/Application/application.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: `${process.env.INIT_CWD}/public`,
      serveStaticOptions: {},
    }),
    AuthModule,
    ApplicationModule,
    CommandModule,
    TenantMigrationCommand,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
