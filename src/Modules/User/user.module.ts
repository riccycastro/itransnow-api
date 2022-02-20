import { Module } from '@nestjs/common';
import UserController from './Controllers/user.controller';
import UserRepository from './Repositories/user.repository';
import { GetUsersUseCase } from './UseCase/GetUsersUseCase';
import { CreateUserUseCase } from './UseCase/CreateUserUseCase';

@Module({
  controllers: [UserController],
  providers: [
    GetUsersUseCase,
    CreateUserUseCase,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
