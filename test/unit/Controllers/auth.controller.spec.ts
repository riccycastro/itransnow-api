import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/Controllers/auth.controller';
import { buildUser } from '../../helper/builder/user.builder';
import { AuthService } from '../../../src/Services/auth.service';
import { createRequest } from 'node-mocks-http';

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
        {
          provide: 'MomentProvider',
          useValue: {},
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
    req = createRequest({
      user: {},
      query: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginAction', () => {
    it('should return user access token', async () => {
      const expectedResult = {
        accessToken: 'aVeryStrongAccessToken',
      };

      const loginSpy = jest
        .spyOn(authService, 'login')
        .mockImplementation(async () => {
          return expectedResult;
        });

      req.user = buildUser();

      expect(await authController.loginAction(req)).toEqual(expectedResult);
      expect(loginSpy).toHaveBeenCalledTimes(1);
    });
  });
});
