import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './Controllers/app.controller';
import { AuthController } from './Controllers/auth.controller';
import { AppService } from './app.service';
import { AuthService } from './Services/auth.service';
import { UserService } from './Services/user.service';
import { BcryptProvider } from './Services/Provider/bcrypt.provider';
import { UserRepository } from './Repositories/user.repository';
import { LocalStrategy } from './Services/Strategy/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './Services/Strategy/jwt.strategy';
import { UserController } from './Controllers/user.controller';
import { CompanyService } from './Services/company.service';
import { CompanyRepository } from './Repositories/company.repository';
import { ApplicationController } from './Controllers/application.controller';
import { ApplicationRepository } from './Repositories/application.repository';
import { ApplicationService } from './Services/application.service';
import { TableListMiddleware } from './Middleware/table-list.middleware';
import { LanguageService } from './Services/language.service';
import { LanguageRepository } from './Repositories/language.repository';
import { SectionService } from './Services/section.service';
import { SectionController } from './Controllers/section.controller';
import { SectionRepository } from './Repositories/section.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([ApplicationRepository, CompanyRepository, UserRepository, LanguageRepository, SectionRepository]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.HASH_EXPIRES_IN },
    }),
  ],
  controllers: [AppController, AuthController, UserController, ApplicationController, SectionController],
  providers: [
    UserService, AppService, AuthService, CompanyService, ApplicationService, LanguageService, SectionService,
    BcryptProvider,
    LocalStrategy, JwtStrategy,
  ],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TableListMiddleware)
      .forRoutes(
        { path: 'applications*', method: RequestMethod.GET },
        { path: 'sections*', method: RequestMethod.GET },
      );
  }
}
