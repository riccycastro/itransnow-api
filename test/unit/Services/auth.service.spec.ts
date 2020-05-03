import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/Services/auth.service';
import { UserService } from '../../../src/Services/user.service';
import { BcryptProvider } from '../../../src/Services/Provider/bcrypt.provider';
import { User } from '../../../src/Entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { buildUserWithId1 } from '../../helper/builder/user.builder';

describe('AuthService', () => {
  let app: TestingModule;
  let authService: AuthService;
  let usersService: UserService;
  let bcryptProvider: BcryptProvider;
  let jwtService: JwtService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        BcryptProvider,
        JwtService,
        {
          provide: 'UserRepository',
          useValue: {},
        },
        {
          provide: 'CompanyService',
          useValue: {},
        },
        {
          provide: 'QueryRunnerProvider',
          useValue: {},
        },
        {
          provide: 'JWT_MODULE_OPTIONS',
          useValue: {},
        },
        {
          provide: 'MomentProvider',
          useValue: {},
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    usersService = app.get<UserService>(UserService);
    bcryptProvider = app.get<BcryptProvider>(BcryptProvider);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return null if user not found', async () => {
      const findByCredentialsSpy = jest
        .spyOn(usersService, 'findByCredentials')
        .mockImplementation(async () => {
          return undefined;
        });

      expect(await authService.validateUser('', '')).toBeNull();
      expect(findByCredentialsSpy).toHaveBeenCalledTimes(1);
    });

    it('should return null if user password doesnt match', async () => {
      const findByCredentialsSpy = jest
        .spyOn(usersService, 'findByCredentials')
        .mockImplementation(async () => {
          return new User();
        });

      const compareSpy = jest
        .spyOn(bcryptProvider, 'compare')
        .mockImplementation(async () => {
          return false;
        });

      expect(await authService.validateUser('', '12345')).toBeNull();
      expect(findByCredentialsSpy).toHaveBeenCalledTimes(1);
      expect(compareSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an user', async () => {
      const findByCredentialsSpy = jest
        .spyOn(usersService, 'findByCredentials')
        .mockImplementation(async () => {
          return new User();
        });

      const compareSpy = jest
        .spyOn(bcryptProvider, 'compare')
        .mockImplementation(async () => {
          return true;
        });

      expect(await authService.validateUser('', '12345')).toEqual(new User());
      expect(findByCredentialsSpy).toHaveBeenCalledTimes(1);
      expect(compareSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should return an object with the access token', async () => {
      const token = '123456qwerty';
      const signSpy = jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        return token;
      });

      expect(await authService.login(buildUserWithId1())).toEqual({
        accessToken: token,
      });
      expect(signSpy).toHaveBeenCalledTimes(1);
    });
  });
});
