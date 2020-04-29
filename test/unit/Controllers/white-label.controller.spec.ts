import { Test, TestingModule } from '@nestjs/testing';
import { WhiteLabelController } from '../../../src/Controllers/white-label.controller';
import { buildWhiteLabelArray, buildWhiteLabelWithId1 } from '../../helper/builder/white-label.builder';
import { ActiveWhiteLabelDto, WhiteLabelDto } from '../../../src/Dto/white-label.dto';
import { WhiteLabelTranslationDto } from '../../../src/Dto/white-label-translation.dto';
import { createRequest } from 'node-mocks-http';
import { ApplicationService } from '../../../src/Services/application.service';
import { buildApplicationWithId1 } from '../../helper/builder/application.builder';
import { buildWhiteLabelTranslation } from '../../helper/builder/white-label-translation.build';

describe('WhiteLabelController', () => {
  let app: TestingModule;
  let whiteLabelController: WhiteLabelController;
  let applicationService: ApplicationService;
  let req: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [WhiteLabelController],
      providers: [
        ApplicationService,
        {
          provide: 'WhiteLabelRepository',
          useValue: {},
        },
        {
          provide: 'LanguageService',
          useValue: {},
        },
        {
          provide: 'TranslationKeyService',
          useValue: {},
        },
        {
          provide: 'TranslationService',
          useValue: {},
        },
        {
          provide: 'TranslationStatusService',
          useValue: {},
        },
        {
          provide: 'QueryRunnerProvider',
          useValue: {},
        },
        {
          provide: 'MomentProvider',
          useValue: {},
        },
        {
          provide: 'ApplicationRepository',
          useValue: {},
        },
        {
          provide: 'SectionService',
          useValue: {},
        },
        {
          provide: 'WhiteLabelService',
          useValue: {},
        },
        {
          provide: 'StringProvider',
          useValue: {},
        },
      ],
    }).compile();

    whiteLabelController = app.get<WhiteLabelController>(WhiteLabelController);
    applicationService = app.get<ApplicationService>(ApplicationService);

    req = createRequest({
      user: {
        companyId: '',
      },
      query: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWhiteLabelAction', () => {
    it('should return a white label', async () => {
      const expectedResult = buildWhiteLabelWithId1();
      const getByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplicationWithId1();
        });

      const getWhiteLabelSpy = jest
        .spyOn(applicationService, 'getWhiteLabel')
        .mockImplementation(async () => {
          return buildWhiteLabelWithId1();
        });

      expect(
        await whiteLabelController.getWhiteLabelAction(
          req,
          'alias',
          'whiteLabelAlias',
        ),
      ).toEqual(expectedResult);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(getWhiteLabelSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getWhiteLabelsAction', () => {
    it('should return a list of white labels with count', async () => {
      const getByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplicationWithId1();
        });

      const getWhiteLabelsSpy = jest
        .spyOn(applicationService, 'getWhiteLabels')
        .mockImplementation(async () => {
          return {
            data: buildWhiteLabelArray(),
            count: 5,
          };
        });

      const expectedResponse = {
        data: buildWhiteLabelArray(),
        count: 5,
      };

      expect(
        await whiteLabelController.getWhiteLabelsAction(req, 'alias'),
      ).toEqual(expectedResponse);
      expect(getWhiteLabelsSpy).toHaveBeenCalledTimes(1);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an empty list of white label with count equal 0', async () => {
      const getByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplicationWithId1();
        });

      const getWhiteLabelsSpy = jest
        .spyOn(applicationService, 'getWhiteLabels')
        .mockImplementation(async () => {
          return { data: [], count: 0 };
        });

      const expectedResponse = { data: [], count: 0 };

      expect(
        await whiteLabelController.getWhiteLabelsAction(req, 'alias'),
      ).toEqual(expectedResponse);
      expect(getWhiteLabelsSpy).toHaveBeenCalledTimes(1);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteWhiteLabelAction', () => {
    it('should call all necessary methods to delete white label', async () => {
      const getByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplicationWithId1();
        });

      const deleteWhiteLabelSpy = jest
        .spyOn(applicationService, 'deleteWhiteLabel')
        .mockImplementation(async () => {
          return buildWhiteLabelWithId1();
        });

      expect(
        await whiteLabelController.deleteWhiteLabelAction(
          req,
          'alias',
          'whiteLabelAlias',
        ),
      ).toBe(undefined);
      expect(deleteWhiteLabelSpy).toHaveBeenCalledTimes(1);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateWhiteLabelAction', () => {
    it('should return a white label', async () => {
      const getByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplicationWithId1();
        });

      const updateWhiteLabelSpy = jest
        .spyOn(applicationService, 'updateWhiteLabel')
        .mockImplementation(async () => {
          return buildWhiteLabelWithId1();
        });

      expect(
        await whiteLabelController.updateWhiteLabelAction(
          req,
          new WhiteLabelDto(),
          'alias',
          'whiteLabelAlias',
        ),
      ).toEqual(buildWhiteLabelWithId1());
      expect(updateWhiteLabelSpy).toHaveBeenCalledTimes(1);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addTranslationToWhiteLabel', () => {
    it('should call all necessary methods to add translation to white label', async () => {
      const getByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplicationWithId1();
        });

      const addTranslationToWhiteLabelSpy = jest
        .spyOn(applicationService, 'addTranslationToWhiteLabel')
        .mockImplementation(async () => {
          return buildWhiteLabelTranslation(1);
        });

      expect(
        await whiteLabelController.addTranslationToWhiteLabel(
          req,
          new WhiteLabelTranslationDto(),
          'alias',
          'whiteLabelAlias',
        ),
      ).toBe(undefined);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(addTranslationToWhiteLabelSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('activeWhiteLabelAction', () => {
    it('should return a white label', async () => {
      const getByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplicationWithId1();
        });

      const activeWhiteLabelSpy = jest
        .spyOn(applicationService, 'activeWhiteLabel')
        .mockImplementation(async () => {
          return buildWhiteLabelWithId1();
        });

      expect(
        await whiteLabelController.activeWhiteLabelAction(
          req,
          new ActiveWhiteLabelDto(),
          'alias',
          'whiteLabelAlias',
        ),
      ).toEqual(buildWhiteLabelWithId1());
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(activeWhiteLabelSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addWhiteLabelToApplicationAction', () => {
    it('should return a white label', async () => {
      const getByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplicationWithId1();
        });

      const createWhiteLabelSpy = jest
        .spyOn(applicationService, 'createWhiteLabel')
        .mockImplementation(async () => {
          return buildWhiteLabelWithId1();
        });

      expect(
        await whiteLabelController.addWhiteLabelToApplicationAction(
          req,
          new WhiteLabelDto(),
          'alias',
        ),
      ).toEqual(buildWhiteLabelWithId1());
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(createWhiteLabelSpy).toHaveBeenCalledTimes(1);
    });
  });
});
