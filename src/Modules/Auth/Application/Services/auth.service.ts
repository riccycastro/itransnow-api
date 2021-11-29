import {Injectable} from "@nestjs/common";
import {UserRepository} from "../../Infrastructure/Repositories/user.repository";
import {BcryptProvider} from "../../../../Core/Providers/bcrypt.provider";
import {User} from "../../Domain/Entities/user.entity";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly bcryptProvider: BcryptProvider
        ) {
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userRepository.findByCredentials(username);
        if (user && (await this.bcryptProvider.compare(pass, user.password))) {
            return user;
        }
        return null;
    }

    async login(user: User) {
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            companyId: user.companyId,
        };

        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
