import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../Entities/user.entity';
import { UserRepository } from '../Repositories/user.repository';
import { RegisterUserDto } from './Dto/RegisterUserDto';
import { BcryptProvider } from './Provider/bcrypt.provider';
import { CompanyService } from './company.service';
import { Connection } from 'typeorm';
import { AbstractEntityService } from './AbstractEntityService';

@Injectable()
export class UserService extends AbstractEntityService {

  private readonly bcryptProvider: BcryptProvider;
  private readonly companyService: CompanyService;
  private readonly connection: Connection;

  constructor(
    userRepository: UserRepository,
    bcryptProvider: BcryptProvider,
    companyService: CompanyService,
    connection: Connection,
  ) {
    super(userRepository);
    this.bcryptProvider = bcryptProvider;
    this.companyService = companyService;
    this.connection = connection;
  }

  async findByCredentials(username: string): Promise<User | undefined> {
    return await (this.repository as UserRepository).findUserByCredentials(username);
  }

  async register(registerUserDto: RegisterUserDto): Promise<User | undefined> {
    if (await this.findByCredentials(registerUserDto.email)) {
      return;
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const company = this.companyService.save(this.companyService.create(registerUserDto.companyName), queryRunner.manager);

      let user = new User();
      user.email = registerUserDto.email;
      user.name = registerUserDto.name;
      user.username = registerUserDto.username;
      user.password = await this.bcryptProvider.hash(registerUserDto.password);
      user.company = company;
      user.isAdmin = true;

      user = await this.save(user, queryRunner.manager);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return user;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new InternalServerErrorException();
    }
  }
}
