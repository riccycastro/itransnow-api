import { Module } from '@nestjs/common';
import { AuthController } from './Controllers/auth.controller';
import { AuthService } from './Services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserRepository from './Repositories/user.repository';
import { PassportModule } from '@nestjs/passport';
import { BcryptProvider } from '../../Core/Providers/bcrypt.provider';
import { LocalStrategy } from './Strategy/local.strategy';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TenantModule } from '../../Core/Tenant/tenant.module';
import MomentProvider from '../../Core/Providers/moment.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.HASH_EXPIRES_IN },
    }),
    TenantModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BcryptProvider,
    MomentProvider,
    LocalStrategy,
    JwtStrategy,
    UserRepository,
  ],
  exports: [JwtStrategy, UserRepository],
})
export class AuthModule {}
