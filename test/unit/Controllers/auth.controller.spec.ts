import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/Controllers/auth.controller';
import { buildUserWithId1 } from '../../helper/builder/user.build';
import { AuthService } from '../../../src/Services/auth.service';

describe('AuthController', () => {
  let app: TestingModule;
  let authController: AuthController;
  let authService: AuthService;
  let req: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'UserService',
          useValue: {},
        },
        {
          provide: 'JwtService',
          useValue: {},
        },
        {
          provide: 'BcryptProvider',
          useValue: {},
        },
        {
          provide: 'CompanyService',
          useValue: {},
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
    req = {
      user: {},
      query: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginAction', () => {
    it('should return user access token', async () => {
      const expectedResult = {
        accessToken: 'aVeryStrongAccessToken',
      };

      const loginSpy = jest.spyOn(authService, 'login').mockImplementation(async () => {
        return expectedResult;
      });

      req.user = buildUserWithId1();

      expect(await authController.loginAction(req)).toEqual(expectedResult);
      expect(loginSpy).toHaveBeenCalledTimes(1);
    });
  });
});
