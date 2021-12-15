import { Inject, Injectable } from '@nestjs/common';
import DomainRepositoryInterface from '../../../../Core/Interfaces/domain.repository.interface';
import User from '../../Domain/Entities/user.entity';

@Injectable()
export default class UserAdapter {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: DomainRepositoryInterface<User>,
  ) {}

  async getList(): Promise<[User[], number]> {
    return this.userRepository.findAndCount(); //{ where: { isVisible: true } }
  }
}
