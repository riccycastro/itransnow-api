import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.HASH_EXPIRES_IN },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [UserService, AppService, AuthService, BcryptProvider, LocalStrategy, JwtStrategy],
})

export class AppModule {}
