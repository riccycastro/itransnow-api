import { Inject, Injectable } from '@nestjs/common';
import DomainRepositoryInterface from '../../../Core/Interfaces/domain.repository.interface';
import User from '../Entities/user.entity';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: DomainRepositoryInterface<User>,
  ) {}

  async run() {
    return this.userRepository.findAndCount({ where: { isVisible: true } });
  }
}
