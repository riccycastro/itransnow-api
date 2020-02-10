import { User } from '../Entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async findUserByCredentials(credential: string): Promise<User | undefined> {
    return await this.findOne({ where: [{ username: credential }, { email: credential }] });
  }
}
