import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import DomainRepositoryInterface from '../../../../Core/Interfaces/domain.repository.interface';
import User from '../../Entities/user.entity';
import { UserCreateType } from '../../Types/user-create.type';
import { StringProvider } from '../../../../Core/Providers/string.provider';
import BooleanProvider from '../../../../Core/Providers/boolean.provider';

Injectable();
export default class UserService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: DomainRepositoryInterface<User>,
  ) {}

  async createUser(userType: UserCreateType, createdBy: User): Promise<User> {
    const user = new User();
    user.name = userType.name;
    user.username = StringProvider.removeDiacritics(userType.username);
    user.isActive = BooleanProvider.toBoolean(userType.isActive);
    user.email = userType.email;

    if (userType.password) {
      if (userType.password !== userType.confirmPassword) {
        // throws invalid password match
      }
      user.password = userType.password;
    }

    return user;
  }
}
