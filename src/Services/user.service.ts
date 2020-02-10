import { Injectable } from '@nestjs/common';
import { User } from '../Entities/user.entity';
import { UserRepository } from '../Repositories/user.repository';

@Injectable()
export class UserService {

  private readonly userRepository: UserRepository;

  constructor(
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  async findUserByCredentials(username: string): Promise<User | undefined> {
    return await this.userRepository.findUserByCredentials(username);
  }
}
