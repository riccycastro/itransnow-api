import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/Services/user.service';
import { UserRepository } from '../../../src/Repositories/user.repository';
import { buildUser } from '../../helper/builder/user.builder';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from '../../../src/Dto/register-user.dto';
import { CompanyService } from '../../../src/Services/company.service';
import { QueryRunner } from '../../../src/Types/type';
import { QueryRunnerProvider } from '../../../src/Services/Provider/query-runner.provider';
import { buildCompany } from '../../helper/builder/company.builder';
import { Company } from '../../../src/Entities/company.entity';
import { BcryptProvider } from '../../../src/Services/Provider/bcrypt.provider';
import { User } from '../../../src/Entities/user.entity';
import { CreateUserDto } from '../../../src/Dto/user.dto';
import { MomentProvider } from '../../../src/Services/Provider/moment.provider';

describe('UserService', () => {
  let app: TestingModule;
  let userService: UserService;
  let userRepository: UserRepository;
  let companyService: CompanyService;
  let queryRunnerProvider: QueryRunnerProvider;
  let bcryptProvider: BcryptProvider;
  let momentProvider: MomentProvider;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        CompanyService,
        QueryRunnerProvider,
        BcryptProvider,
        MomentProvider,
        {
          provide: 'CompanyRepository',
          useValue: {},
        },
        {
          provide: 'Connection',
          useValue: {},
        },
        {
          provide: 'StringProvider',
          useValue: {},
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    userRepository = app.get<UserRepository>(UserRepository);
    companyService = app.get<CompanyService>(CompanyService);
    queryRunnerProvider = app.get<QueryRunnerProvider>(QueryRunnerProvider);
    bcryptProvider = app.get<BcryptProvider>(BcryptProvider);
    momentProvider = app.get<MomentProvider>(MomentProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByCredentials', () => {
    it('should return undefined if user nor found', async () => {
      const findUserByCredentialsSpy = jest
        .spyOn(userRepository, 'findUserByCredentials')
        .mockImplementation(async () => {
          return undefined;
        });

      expect(await userService.findByCredentials('username')).toBeUndefined();
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an user', async () => {
      const findUserByCredentialsSpy = jest
        .spyOn(userRepository, 'findUserByCredentials')
        .mockImplementation(async () => {
          return buildUser();
        });

      expect(await userService.findByCredentials('username')).toEqual(
        buildUser(),
      );
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should throw a not found exception', async () => {
      const findOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(async () => {
          return undefined;
        });

      await expect(userService.getById(1)).rejects.toThrow(NotFoundException);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an user', async () => {
      const findOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(async () => {
          return buildUser();
        });

      expect(await userService.getById(1)).toEqual(buildUser());
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('register', () => {
    it('should return undefined', async () => {
      const findUserByCredentialsSpy = jest
        .spyOn(userRepository, 'findUserByCredentials')
        .mockImplementation(async () => {
          return buildUser();
        });

      const registerUserDto = new RegisterUserDto();
      registerUserDto.email = 'fake@email.phake';

      expect(await userService.register(registerUserDto)).toBeUndefined();
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
    });

    it('should an internal server error exception on company save', async () => {
      const findUserByCredentialsSpy = jest
        .spyOn(userRepository, 'findUserByCredentials')
        .mockImplementation(async () => {
          return undefined;
        });

      const companyServiceCreateSpy = jest
        .spyOn(companyService, 'create')
        .mockImplementation(() => {
          return buildCompany();
        });

      const companyServiceSaveSpy = jest
        .spyOn(companyService, 'save')
        .mockImplementation(async () => {
          throw new Error();
        });

      const createQueryRunnerSpy = jest
        .spyOn(queryRunnerProvider, 'createQueryRunner')
        .mockImplementation(() => {
          return {
            startTransaction() {
              return;
            },
            release() {
              return;
            },
            rollbackTransaction() {
              return;
            },
          } as QueryRunner;
        });

      const registerUserDto = new RegisterUserDto();
      registerUserDto.email = 'fake@email.phake';

      await expect(userService.register(registerUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(companyServiceSaveSpy).toHaveBeenCalledTimes(1);
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(companyServiceCreateSpy).toHaveBeenCalledTimes(1);
    });

    it('should an internal server error exception on user save', async () => {
      const findUserByCredentialsSpy = jest
        .spyOn(userRepository, 'findUserByCredentials')
        .mockImplementation(async () => {
          return undefined;
        });

      const companyServiceCreateSpy = jest
        .spyOn(companyService, 'create')
        .mockImplementation(() => {
          return buildCompany();
        });

      const companyServiceSaveSpy = jest
        .spyOn(companyService, 'save')
        .mockImplementation(async (company: Company) => {
          return company;
        });

      const hashSpy = jest
        .spyOn(bcryptProvider, 'hash')
        .mockImplementation(async () => {
          return '';
        });

      const userSaveSpy = jest
        .spyOn(userRepository, 'save')
        .mockImplementation(async () => {
          throw new Error();
        });

      const createQueryRunnerSpy = jest
        .spyOn(queryRunnerProvider, 'createQueryRunner')
        .mockImplementation(() => {
          return {
            startTransaction() {
              return;
            },
            release() {
              return;
            },
            rollbackTransaction() {
              return;
            },
          } as QueryRunner;
        });

      const registerUserDto = new RegisterUserDto();
      registerUserDto.email = 'fake@email.phake';
      registerUserDto.name = 'fake';
      registerUserDto.username = 'phake';
      registerUserDto.password = 'phakest';

      await expect(userService.register(registerUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(companyServiceSaveSpy).toHaveBeenCalledTimes(1);
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(hashSpy).toHaveBeenCalledTimes(1);
      expect(companyServiceCreateSpy).toHaveBeenCalledTimes(1);
      expect(userSaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a new user', async () => {
      const findUserByCredentialsSpy = jest
        .spyOn(userRepository, 'findUserByCredentials')
        .mockImplementation(async () => {
          return undefined;
        });

      const companyServiceCreateSpy = jest
        .spyOn(companyService, 'create')
        .mockImplementation(() => {
          return buildCompany();
        });

      const companyServiceSaveSpy = jest
        .spyOn(companyService, 'save')
        .mockImplementation(async (company: Company) => {
          return company;
        });

      const hashSpy = jest
        .spyOn(bcryptProvider, 'hash')
        .mockImplementation(async () => {
          return '';
        });

      const userSaveSpy = jest
        .spyOn(userRepository, 'save')
        .mockImplementation(async () => {
          return buildUser();
        });

      const createQueryRunnerSpy = jest
        .spyOn(queryRunnerProvider, 'createQueryRunner')
        .mockImplementation(() => {
          return {
            startTransaction() {
              return;
            },
            release() {
              return;
            },
            commitTransaction() {
              return;
            },
          } as QueryRunner;
        });

      const registerUserDto = new RegisterUserDto();
      registerUserDto.email = 'fake@email.phake';
      registerUserDto.name = 'fake';
      registerUserDto.username = 'phake';
      registerUserDto.password = 'phakest';

      expect(await userService.register(registerUserDto)).toEqual(
        buildUser(),
      );
      expect(companyServiceSaveSpy).toHaveBeenCalledTimes(1);
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(hashSpy).toHaveBeenCalledTimes(1);
      expect(companyServiceCreateSpy).toHaveBeenCalledTimes(1);
      expect(userSaveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByCredentialsInCompany', () => {
    it('should return undefined if user not found', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockImplementation(async () => {
        return undefined;
      });

      expect(await userService.findByCredentialsInCompany(1, 'credential')).toBeUndefined();
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the found user', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockImplementation(async () => {
        return buildUser();
      });

      expect(await userService.findByCredentialsInCompany(1, 'credential')).toEqual(buildUser());
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByUsernameOrFail', () => {
    it('should throw a not found exception', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOne')
        .mockImplementation(async () => undefined);

      await expect(userService.getByUsernameOrFail(1, 'username'))
        .rejects
        .toThrow(NotFoundException);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an user', async () => {
      const getByUsernameSpy = jest.spyOn(userRepository, 'findOne')
        .mockImplementation(async () => buildUser());

      expect(await userService.getByUsernameOrFail(1, 'username'))
        .toEqual(buildUser());
      expect(getByUsernameSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should throw a conflict exception', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOne')
        .mockImplementation(async () => new User());

      const createUserDto = new CreateUserDto();
      createUserDto.email = 'phake@fake,com';
      createUserDto.username = 'phake_fake';

      await expect(userService.create(1, createUserDto))
        .rejects.toThrow(ConflictException);
      expect(findOneSpy).toHaveBeenCalledTimes(2);
    });

    it('should return the created user', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOne')
        .mockImplementation(async () => undefined);

      const hashSpy = jest.spyOn(bcryptProvider, 'hash')
        .mockImplementation(async () => 'phakepassword');

      const createUserDto = new CreateUserDto();
      createUserDto.email = 'phake@fake.com';
      createUserDto.name = 'phake name';
      createUserDto.username = 'phake_fake';
      createUserDto.password = 'phake';

      const expectedResult = new User();
      expectedResult.email = 'phake@fake.com';
      expectedResult.name = 'phake name';
      expectedResult.username = 'phake_fake';
      expectedResult.password = 'phakepassword';
      expectedResult.company = 1;

      expect(await userService.create(1, createUserDto))
        .toEqual(expectedResult);
      expect(findOneSpy).toHaveBeenCalledTimes(2);
      expect(hashSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setAdminUser', () => {
    it('should return an admin user', () => {
      expect(userService.setAdminUser(
        buildUser(),
        { isAdmin: true },
      )).toEqual(buildUser({ isAdmin: true }));
    });

    it('should return a non admin user', () => {
      expect(userService.setAdminUser(
        buildUser({ isAdmin: true }),
        { isAdmin: false },
      )).toEqual(buildUser());
    });
  });

  describe('setActive', () => {
    it('should return an active user', () => {
      expect(userService.setActive(
        buildUser({ isActive: false }),
        { isActive: true }))
        .toEqual(buildUser());
    });

    it('should return an inactive user', () => {
      expect(userService.setActive(buildUser(), { isActive: false }))
        .toEqual(buildUser({ isActive: false }));
    });
  });

  describe('delete', () => {
    it('should return a deleted user', () => {
      const unixSpy = jest.spyOn(momentProvider, 'unix')
        .mockImplementation(() => {
          return 123456;
        });

      expect(userService.delete(buildUser()))
        .toEqual(buildUser({ deletedAt: 123456 }));
      expect(unixSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should return the updated user', () => {
      expect(userService.update(buildUser(), { name: 'New name' }))
        .toEqual(buildUser({ name: 'New name' }));
    });
  });
});
