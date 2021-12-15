import { Module } from '@nestjs/common';
import UserAdapter from './Application/Adapters/user.adapter';
import UserController from './Presentation/Controllers/user.controller';
import UserRepository from './Infrastructure/Repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserAdapter,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
