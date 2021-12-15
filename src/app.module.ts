import { Global, Module } from '@nestjs/common';
import { AuthModule } from './Modules/Auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './Core/Filters/Exceptions/http-exception.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommandModule } from 'nestjs-command';
import { TenantMigrationCommand } from './Core/Commands/tenant.migration.command';
import { ApplicationModule } from './Modules/Application/application.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ViewModule } from './Core/View/view.module';
import { UserModule } from './Modules/User/user.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: `${process.env.INIT_CWD}/public`,
      serveStaticOptions: {},
    }),
    ViewModule,
    AuthModule,
    ApplicationModule,
    UserModule,
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
