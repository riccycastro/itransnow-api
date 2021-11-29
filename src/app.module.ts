import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './Controllers/app.controller';
import {AuthController} from './Controllers/auth.controller';
import {AuthService} from './Services/auth.service';
import {UserService} from './Services/user.service';
import {UserRepository} from './Repositories/user.repository';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserController} from './Controllers/user.controller';
import {CompanyService} from './Services/company.service';
import {CompanyRepository} from './Repositories/company.repository';
import {ApplicationController} from './Controllers/application.controller';
import {ApplicationRepository} from './Repositories/application.repository';
import {ApplicationService} from './Services/application.service';
import {TableListMiddleware} from './Middleware/table-list.middleware';
import {LanguageService} from './Services/language.service';
import {LanguageRepository} from './Repositories/language.repository';
import {SectionService} from './Services/section.service';
import {SectionController} from './Controllers/section.controller';
import {SectionRepository} from './Repositories/section.repository';
import {TranslationController} from './Controllers/translation.controller';
import {TranslationService} from './Services/translation.service';
import {TranslationRepository} from './Repositories/translation.repository';
import {TranslationKeyRepository} from './Repositories/translation-key.repository';
import {TranslationKeyService} from './Services/translation-key.service';
import {TranslationStatusRepository} from './Repositories/translation-status.repository';
import {TranslationStatusService} from './Services/translation-status.service';
import {WhiteLabelRepository} from './Repositories/white-label.repository';
import {WhiteLabelService} from './Services/white-label.service';
import {WhiteLabelController} from './Controllers/white-label.controller';
import {ExtensionValidatorMiddleware} from './Middleware/extension-validator.middleware';
import {MomentProvider} from './Services/Provider/moment.provider';
import {QueryRunnerProvider} from './Services/Provider/query-runner.provider';
import {StringProvider} from './Services/Provider/string.provider';
import {TranslationKeyController} from './Controllers/translation-key.controller';
import {CommandModule} from 'nestjs-command';
import {TranslationCommand} from './Commands/translation.command';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {TimeoutInterceptor} from './Interceptors/TimeoutInterceptor';
import {AuthModule} from "./Modules/Auth/auth.module";
import {BcryptProvider} from "./Core/Providers/bcrypt.provider";
import {ServeStaticModule} from "@nestjs/serve-static";

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([
            ApplicationRepository,
            CompanyRepository,
            UserRepository,
            LanguageRepository,
            SectionRepository,
            TranslationRepository,
            TranslationKeyRepository,
            TranslationStatusRepository,
            WhiteLabelRepository,
        ]),
        ServeStaticModule.forRoot({
            rootPath: `${process.env.INIT_CWD}/public`,
            serveStaticOptions: {}
        }),
        CommandModule,
        AuthModule
    ],
    controllers: [
        AppController,
        AuthController,
        UserController,
        ApplicationController,
        SectionController,
        TranslationController,
        WhiteLabelController,
        TranslationKeyController,
    ],
    providers: [
        UserService,
        AuthService,
        CompanyService,
        ApplicationService,
        LanguageService,
        SectionService,
        TranslationService,
        TranslationKeyService,
        TranslationStatusService,
        WhiteLabelService,
        BcryptProvider,
        MomentProvider,
        QueryRunnerProvider,
        StringProvider,
        TranslationCommand,
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor
        },
    ],
    exports: [
        BcryptProvider
    ]
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(TableListMiddleware)
            .forRoutes(
                {path: 'applications*', method: RequestMethod.GET},
                {path: 'sections*', method: RequestMethod.GET},
                {path: 'white-labels*', method: RequestMethod.GET},
                {path: 'users*', method: RequestMethod.GET},
            )
            .apply(ExtensionValidatorMiddleware)
            .forRoutes({path: 'translations.*', method: RequestMethod.GET})
    }
}
