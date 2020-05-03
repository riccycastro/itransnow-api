import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/Controllers/user.controller';
import { buildUserArray, buildUserWithId1 } from '../../helper/builder/user.builder';
import { createRequest } from 'node-mocks-http';
import { UserService } from '../../../src/Services/user.service';
import { ActiveUserDto, AdminUserDto, CreateUserDto, UserDto } from '../../../src/Dto/user.dto';

describe('UserController', () => {
  let app: TestingModule;
  let userController: UserController;
  let userService: UserService;
  let req: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [
        UserController,
      ],
      providers: [
        UserService,
        {
          provide: 'MomentProvider',
          useValue: {},
        },
        {
          provide: 'UserRepository',
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
          provide: 'QueryRunnerProvider',
          useValue: {},
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);

    req = createRequest({
      user: {
        companyId: 1,
      },
      query: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('profileAction', () => {
    it('should return a user', () => {
      const expectedResult = buildUserWithId1();
      req.user = expectedResult;

      expect(userController.profileAction(req)).toEqual(expectedResult);
    });
  });

  describe('createAction', () => {
    it('should return the new user', async () => {
      const saveSpy = jest.spyOn(userService, 'save').mockImplementation(async (user) => {
        return user;
      });

      const createSpy = jest.spyOn(userService, 'create').mockImplementation(async () => {
        return buildUserWithId1();
      });

      expect(await userController.createAction(req, new CreateUserDto())).toEqual(buildUserWithId1());
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserAction', () => {
    it('should return a user', async () => {
      const getByUsernameOrFailSpy = jest.spyOn(userService, 'getByUsernameOrFail').mockImplementation(async () => {
        return buildUserWithId1();
      });

      expect(await userController.getUserAction(req, 'username')).toEqual(buildUserWithId1());
      expect(getByUsernameOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUsersAction', () => {
    it('should return a list of user', async () => {
      const findInListSpy = jest.spyOn(userService, 'findInList').mockImplementation(async () => {
        return {
          data: buildUserArray(),
          count: 5,
        };
      });

      expect(await userController.getUsersAction(req))
        .toEqual({
          data: buildUserArray(),
          count: 5,
        });
      expect(findInListSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateAction', () => {
    it('should return the updated user', async () => {
      const saveSpy = jest.spyOn(userService, 'save').mockImplementation(async (user) => {
        return user;
      });

      const updateSpy = jest.spyOn(userService, 'update').mockImplementation((user) => {
        return user;
      });

      const getByUsernameOrFailSpy = jest.spyOn(userService, 'getByUsernameOrFail').mockImplementation(async () => {
        return buildUserWithId1();
      });

      expect(await userController.updateAction(req, new UserDto(), 'username'))
        .toEqual(buildUserWithId1());
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(getByUsernameOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteAction', () => {
    it('should call all necessary methods to delete user', async () => {
      const saveSpy = jest.spyOn(userService, 'save').mockImplementation(async (user) => {
        return user;
      });

      const deleteSpy = jest.spyOn(userService, 'delete').mockImplementation((user) => {
        return user;
      });

      const getByUsernameOrFailSpy = jest.spyOn(userService, 'getByUsernameOrFail').mockImplementation(async () => {
        return buildUserWithId1();
      });

      expect(await userController.deleteAction(req, 'username'))
        .toBeUndefined();
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(getByUsernameOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setAdminAction', () => {
    it('should return an user', async () => {
      const saveSpy = jest.spyOn(userService, 'save').mockImplementation(async (user) => {
        return user;
      });

      const setAdminUserSpy = jest.spyOn(userService, 'setAdminUser').mockImplementation((user) => {
        return user;
      });

      const getByUsernameOrFailSpy = jest.spyOn(userService, 'getByUsernameOrFail').mockImplementation(async () => {
        return buildUserWithId1();
      });

      expect(await userController.setAdminAction(req, new AdminUserDto(), 'username'))
        .toEqual(buildUserWithId1());
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(setAdminUserSpy).toHaveBeenCalledTimes(1);
      expect(getByUsernameOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setActiveAction', () => {
    it('should return an user', async () => {
      const saveSpy = jest.spyOn(userService, 'save').mockImplementation(async (user) => {
        return user;
      });

      const setActiveSpy = jest.spyOn(userService, 'setActive').mockImplementation((user) => {
        return user;
      });

      const getByUsernameOrFailSpy = jest.spyOn(userService, 'getByUsernameOrFail').mockImplementation(async () => {
        return buildUserWithId1();
      });

      expect(await userController.setActiveAction(req, new ActiveUserDto(), 'username'))
        .toEqual(buildUserWithId1());
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(setActiveSpy).toHaveBeenCalledTimes(1);
      expect(getByUsernameOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });
});
