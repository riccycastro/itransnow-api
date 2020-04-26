import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/Services/user.service';
import { UserRepository } from '../../../src/Repositories/user.repository';
import { buildUserWithId1 } from '../../helper/builder/user.builder';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from '../../../src/Dto/register-user.dto';
import { CompanyService } from '../../../src/Services/company.service';
import { QueryRunner } from '../../../src/Types/type';
import { QueryRunnerProvider } from '../../../src/Services/Provider/query-runner.provider';
import { buildCompanyWithId1 } from '../../helper/builder/company.builder';
import { Company } from '../../../src/Entities/company.entity';
import { BcryptProvider } from '../../../src/Services/Provider/bcrypt.provider';

describe('UserService', () => {
  let app: TestingModule;
  let userService: UserService;
  let userRepository: UserRepository;
  let companyService: CompanyService;
  let queryRunnerProvider: QueryRunnerProvider;
  let bcryptProvider: BcryptProvider;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        CompanyService,
        QueryRunnerProvider,
        BcryptProvider,
        {
          provide: 'CompanyRepository',
          useValue: {},
        },
        {
          provide: 'Connection',
          useValue: {},
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    userRepository = app.get<UserRepository>(UserRepository);
    companyService = app.get<CompanyService>(CompanyService);
    queryRunnerProvider = app.get<QueryRunnerProvider>(QueryRunnerProvider);
    bcryptProvider = app.get<BcryptProvider>(BcryptProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByCredentials', () => {
    it('should return undefined if user nor found', async () => {
      const findUserByCredentialsSpy = jest.spyOn(userRepository, 'findUserByCredentials').mockImplementation(async () => {
        return undefined;
      });

      expect(await userService.findByCredentials('username')).toBeUndefined();
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an user', async () => {
      const findUserByCredentialsSpy = jest.spyOn(userRepository, 'findUserByCredentials').mockImplementation(async () => {
        return buildUserWithId1();
      });

      expect(await userService.findByCredentials('username')).toEqual(buildUserWithId1());
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should throw a not found exception', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockImplementation(async () => {
        return undefined;
      });

      await expect(userService.getById(1)).rejects.toThrow(NotFoundException);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an user', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockImplementation(async () => {
        return buildUserWithId1();
      });

      expect(await userService.getById(1)).toEqual(buildUserWithId1());
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('register', () => {
    it('should return undefined', async () => {
      const findUserByCredentialsSpy = jest.spyOn(userRepository, 'findUserByCredentials').mockImplementation(async () => {
        return buildUserWithId1();
      });

      const registerUserDto = new RegisterUserDto();
      registerUserDto.email = 'fake@email.phake';

      expect(await userService.register(registerUserDto)).toBeUndefined();
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
    });

    it('should an internal server error exception on company save', async () => {

      const findUserByCredentialsSpy = jest.spyOn(userRepository, 'findUserByCredentials').mockImplementation(async () => {
        return undefined;
      });

      const companyServiceCreateSpy = jest.spyOn(companyService, 'create').mockImplementation(() => {
        return buildCompanyWithId1();
      });


      const companyServiceSaveSpy = jest.spyOn(companyService, 'save').mockImplementation(async () => {
        throw new Error();
      });

      const createQueryRunnerSpy = jest.spyOn(queryRunnerProvider, 'createQueryRunner').mockImplementation(() => {
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

      await expect(userService.register(registerUserDto)).rejects.toThrow(InternalServerErrorException);
      expect(companyServiceSaveSpy).toHaveBeenCalledTimes(1);
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(companyServiceCreateSpy).toHaveBeenCalledTimes(1);
    });

    it('should an internal server error exception on user save', async () => {
      const findUserByCredentialsSpy = jest.spyOn(userRepository, 'findUserByCredentials').mockImplementation(async () => {
        return undefined;
      });

      const companyServiceCreateSpy = jest.spyOn(companyService, 'create').mockImplementation(() => {
        return buildCompanyWithId1();
      });

      const companyServiceSaveSpy = jest.spyOn(companyService, 'save').mockImplementation(async (company: Company) => {
        return company;
      });


      const hashSpy = jest.spyOn(bcryptProvider, 'hash').mockImplementation(async () => {
        return '';
      });

      const userSaveSpy = jest.spyOn(userRepository, 'save').mockImplementation(async () => {
        throw new Error();
      });

      const createQueryRunnerSpy = jest.spyOn(queryRunnerProvider, 'createQueryRunner').mockImplementation(() => {
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

      await expect(userService.register(registerUserDto)).rejects.toThrow(InternalServerErrorException);
      expect(companyServiceSaveSpy).toHaveBeenCalledTimes(1);
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(hashSpy).toHaveBeenCalledTimes(1);
      expect(companyServiceCreateSpy).toHaveBeenCalledTimes(1);
      expect(userSaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a new user', async () => {
      const findUserByCredentialsSpy = jest.spyOn(userRepository, 'findUserByCredentials').mockImplementation(async () => {
        return undefined;
      });

      const companyServiceCreateSpy = jest.spyOn(companyService, 'create').mockImplementation(() => {
        return buildCompanyWithId1();
      });

      const companyServiceSaveSpy = jest.spyOn(companyService, 'save').mockImplementation(async (company: Company) => {
        return company;
      });


      const hashSpy = jest.spyOn(bcryptProvider, 'hash').mockImplementation(async () => {
        return '';
      });

      const userSaveSpy = jest.spyOn(userRepository, 'save').mockImplementation(async () => {
        return buildUserWithId1();
      });

      const createQueryRunnerSpy = jest.spyOn(queryRunnerProvider, 'createQueryRunner').mockImplementation(() => {
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

      expect(await userService.register(registerUserDto)).toEqual(buildUserWithId1());
      expect(companyServiceSaveSpy).toHaveBeenCalledTimes(1);
      expect(findUserByCredentialsSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(hashSpy).toHaveBeenCalledTimes(1);
      expect(companyServiceCreateSpy).toHaveBeenCalledTimes(1);
      expect(userSaveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
