import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from '../Entities/user.entity';
import { UserRepository } from '../Repositories/user.repository';
import { RegisterUserDto } from '../Dto/register-user.dto';
import { BcryptProvider } from './Provider/bcrypt.provider';
import { CompanyService } from './company.service';
import { QueryRunnerProvider } from './Provider/query-runner.provider';
import { AbstractEntityListingService } from './abstract-entity-listing.service';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';
import { ActiveUserDto, AdminUserDto, CreateUserDto, UserDto } from '../Dto/user.dto';
import { MomentProvider } from './Provider/moment.provider';

@Injectable()
export class UserService extends AbstractEntityListingService<User> {

  constructor(
    userRepository: UserRepository,
    private readonly bcryptProvider: BcryptProvider,
    private readonly companyService: CompanyService,
    private readonly queryRunnerProvider: QueryRunnerProvider,
    private readonly momentProvider: MomentProvider,
  ) {
    super(userRepository);
  }

  async findByCredentials(username: string): Promise<User | undefined> {
    return await (this.repository as UserRepository).findUserByCredentials(
      username,
    );
  }

  async getById(id: number): Promise<User> {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<User | undefined> {
    if (await this.findByCredentials(registerUserDto.email)) {
      return;
    }

    const queryRunner = this.queryRunnerProvider.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const company = await this.companyService.save(
        this.companyService.create(registerUserDto.companyName),
        queryRunner.manager,
      );

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

  async findByCredentialsInCompany(companyId: number, credential: string): Promise<User | undefined> {
    return this.repository.findOne({
      where: [{ username: credential, company: companyId }, { email: credential, company: companyId }],
    });
  }

  async getByUsernameOrFail(companyId: number, username: string): Promise<User> {
    const user = await this.getByUsername(companyId, username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  private async getByUsername(companyId: number, username: string): Promise<User | undefined> {
    return await this.repository.findOne({
      where: { username: username, company: companyId },
    });
  }

  async create(companyId: number, createUserDto: CreateUserDto) {
    const existentUsers = await Promise.all(
      [
        this.findByCredentialsInCompany(companyId, createUserDto.username),
        this.findByCredentialsInCompany(companyId, createUserDto.email),
      ],
    );

    for (const existentUser of existentUsers) {
      if (existentUser) {
        throw new ConflictException('User already exists');
      }
    }

    const user = new User();
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.password = await this.bcryptProvider.hash(createUserDto.password);
    user.company = companyId;
    return user;
  }

  setAdminUser(user: User, adminUserDto: AdminUserDto): User {
    user.isAdmin = adminUserDto.isAdmin;
    return user;
  }

  setActive(user: User, activeUserDto: ActiveUserDto): User {
    user.isActive = activeUserDto.isActive;
    return user;
  }

  delete(user: User): User {
    user.deletedAt = this.momentProvider.unix();
    return user;
  }

  update(user: User, userDto: UserDto) {
    user.name = userDto.name;
    return user;
  }

  async getSystemUser(): Promise<User> {
    return this.repository.findOne({ isVisible: false, id: 1 });
  }

  protected async getEntityListAndCount(companyId: number, query?: QueryPaginationInterface): Promise<[User[], number]> {
    const listResult = await (this.repository as UserRepository).findInList(companyId, query);

    for await (let user of listResult[0]) {
      user = await this.getIncludes(companyId, user, query);
    }

    return listResult;
  }
}
