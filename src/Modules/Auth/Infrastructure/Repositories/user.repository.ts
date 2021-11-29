import {EntityRepository} from "typeorm";
import {User} from "../../Domain/Entities/user.entity";
import {RepositoryCore} from "../../../../Core/Repositories/repository.core";

@EntityRepository(User)
export class UserRepository extends RepositoryCore<User> {
    async findByCredentials(credential: string): Promise<User | undefined> {
        return this.findOne({
            where: [{ username: credential }, { email: credential }],
        });
    }
}
