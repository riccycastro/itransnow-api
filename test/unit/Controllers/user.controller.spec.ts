import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/Controllers/user.controller';
import { buildUserWithId1 } from '../../helper/builder/user.build';

describe('UserController', () => {
  let app: TestingModule;
  let userController: UserController;
  let req: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    userController = app.get<UserController>(UserController);

    req = {
      user: {},
      query: {},
    };
  });

  describe('profileAction', () => {
    it('should return a user', () => {
      const expectedResult = buildUserWithId1();
      req.user = expectedResult;

      expect(userController.profileAction(req)).toEqual(expectedResult);
    });
  });
});
