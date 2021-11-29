import {Module} from "@nestjs/common";
import {AuthController} from "./Presentation/Controllers/auth.controller";
import {AuthService} from "./Application/Services/auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "./Infrastructure/Repositories/user.repository";
import {PassportModule} from "@nestjs/passport";
import {BcryptProvider} from "../../Core/Providers/bcrypt.provider";
import {LocalStrategy} from "./Application/Strategy/local.strategy";
import {JwtStrategy} from "./Application/Strategy/jwt.strategy";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([
            UserRepository
        ]),
        PassportModule,
        JwtModule.register({
            secret: process.env.SECRET,
            signOptions: {expiresIn: process.env.HASH_EXPIRES_IN},
        }),
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        BcryptProvider,
        LocalStrategy,
        JwtStrategy,
    ],
})

export class AuthModule {
}

