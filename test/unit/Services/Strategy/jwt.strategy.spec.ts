import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../../src/Services/user.service';
import { CompanyService } from '../../../../src/Services/company.service';
import { buildUserWithId1 } from '../../../helper/builder/user.builder';
import { buildCompanyWithId1 } from '../../../helper/builder/company.builder';
import { JwtStrategy } from '../../../../src/Services/Strategy/jwt.strategy';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let app: TestingModule;
  let userService: UserService;
  let companyService: CompanyService;
  let jwtStrategy: JwtStrategy;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        UserService,
        CompanyService,
        {
          provide: 'UserRepository',
          useValue: {},
        },
        {
          provide: 'BcryptProvider',
          useValue: {},
        },
        {
          provide: 'QueryRunnerProvider',
          useValue: {},
        },
        {
          provide: 'CompanyRepository',
          useValue: {},
        },
        {
          provide: 'StringProvider',
          useValue: {},
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    companyService = app.get<CompanyService>(CompanyService);
    jwtStrategy = app.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should throw a not found error exception if company is deleted', async () => {
      const findUserByIdSpy = jest
        .spyOn(userService, 'getById')
        .mockImplementation(async () => {
          return buildUserWithId1();
        });

      const findCompanyByIdSpy = jest
        .spyOn(companyService, 'getById')
        .mockImplementation(async () => {
          const company = buildCompanyWithId1();
          company.deletedAt = 123;
          return company;
        });

      await expect(
        jwtStrategy.validate({ sub: 1, companyId: 1 }),
      ).rejects.toThrow(NotFoundException);
      expect(findUserByIdSpy).toHaveBeenCalledTimes(1);
      expect(findCompanyByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("should throw a not forbidden error exception if company isn't active", async () => {
      const findUserByIdSpy = jest
        .spyOn(userService, 'getById')
        .mockImplementation(async () => {
          return buildUserWithId1();
        });

      const findCompanyByIdSpy = jest
        .spyOn(companyService, 'getById')
        .mockImplementation(async () => {
          const company = buildCompanyWithId1();
          company.isActive = false;
          return company;
        });

      await expect(
        jwtStrategy.validate({ sub: 1, companyId: 1 }),
      ).rejects.toThrow(ForbiddenException);
      expect(findUserByIdSpy).toHaveBeenCalledTimes(1);
      expect(findCompanyByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found error exception if user is deleted', async () => {
      const findUserByIdSpy = jest
        .spyOn(userService, 'getById')
        .mockImplementation(async () => {
          const user = buildUserWithId1();
          user.deletedAt = 123;
          return user;
        });

      const findCompanyByIdSpy = jest
        .spyOn(companyService, 'getById')
        .mockImplementation(async () => {
          return buildCompanyWithId1();
        });

      await expect(
        jwtStrategy.validate({ sub: 1, companyId: 1 }),
      ).rejects.toThrow(NotFoundException);
      expect(findUserByIdSpy).toHaveBeenCalledTimes(1);
      expect(findCompanyByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("should throw a not forbidden error exception if user isn't active", async () => {
      const findUserByIdSpy = jest
        .spyOn(userService, 'getById')
        .mockImplementation(async () => {
          const user = buildUserWithId1();
          user.isActive = false;
          return user;
        });

      const findCompanyByIdSpy = jest
        .spyOn(companyService, 'getById')
        .mockImplementation(async () => {
          return buildCompanyWithId1();
        });

      await expect(
        jwtStrategy.validate({ sub: 1, companyId: 1 }),
      ).rejects.toThrow(ForbiddenException);
      expect(findUserByIdSpy).toHaveBeenCalledTimes(1);
      expect(findCompanyByIdSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the payload user', async () => {
      const findUserByIdSpy = jest
        .spyOn(userService, 'getById')
        .mockImplementation(async () => {
          return buildUserWithId1();
        });

      const findCompanyByIdSpy = jest
        .spyOn(companyService, 'getById')
        .mockImplementation(async () => {
          return buildCompanyWithId1();
        });

      expect(await jwtStrategy.validate({ sub: 1, companyId: 1 })).toEqual(
        buildUserWithId1(),
      );
      expect(findUserByIdSpy).toHaveBeenCalledTimes(1);
      expect(findCompanyByIdSpy).toHaveBeenCalledTimes(1);
    });
  });
});
