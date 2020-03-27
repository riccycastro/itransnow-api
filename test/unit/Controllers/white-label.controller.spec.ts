import { Test, TestingModule } from '@nestjs/testing';
import { WhiteLabelController } from '../../../src/Controllers/white-label.controller';
import { WhiteLabelService } from '../../../src/Services/white-label.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { buildWhitelabel, buildWhiteLabelWithId1 } from '../../helper/builder/white-label.builder';
import { ActiveWhiteLabelDto, WhiteLabelDto } from '../../../src/Dto/white-label.dto';
import { WhiteLabelTranslationDto } from '../../../src/Dto/white-label-translation.dto';
import { WhiteLabelTranslation } from '../../../src/Entities/white-label-translation.entity';

describe('WhiteLabelController', () => {
  let app: TestingModule;
  let whiteLabelController: WhiteLabelController;
  let whiteLabelService: WhiteLabelService;
  let req: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [WhiteLabelController],
      providers: [
        WhiteLabelService,
        {
          provide: 'WhiteLabelRepository',
          useValue: {},
        },
        {
          provide: 'ApplicationService',
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
          provide: 'Connection',
          useValue: {},
        },
      ],
    }).compile();

    whiteLabelController = app.get<WhiteLabelController>(WhiteLabelController);
    whiteLabelService = app.get<WhiteLabelService>(WhiteLabelService);

    req = {
      user: {
        companyId: '',
      },
      query: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWhiteLabelAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(whiteLabelController.getWhiteLabelAction(req, 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a white label', async () => {
      const expectedResult = buildWhiteLabelWithId1();
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await whiteLabelController.getWhiteLabelAction(req, 'alias')).toEqual(expectedResult);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getWhiteLabelsAction', () => {
    it('should return a list of white labels with count', async () => {
      const expectedResponse = {
        data: [1, 2, 3, 4, 5].map(index => {
          return buildWhitelabel(index);
        }),
        count: 5,
      };

      const findInListSpy = jest.spyOn(whiteLabelService, 'findInList').mockImplementation(async () => {
        return expectedResponse;
      });

      expect(await whiteLabelController.getWhiteLabelsAction(req)).toEqual(expectedResponse);
      expect(findInListSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an empty list of white label with count equal 0', async () => {
      const expectedResponse = { data: [], count: 0 };

      const findInListSpy = jest.spyOn(whiteLabelService, 'findInList').mockImplementation(async () => {
        return expectedResponse;
      });

      expect(await whiteLabelController.getWhiteLabelsAction(req)).toEqual(expectedResponse);
      expect(findInListSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteWhiteLabelAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(whiteLabelController.deleteWhiteLabelAction(req, 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should call all necessary methods to delete white label', async () => {
      const whiteLabel = buildWhiteLabelWithId1();
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return whiteLabel;
      });

      const deleteSpy = jest.spyOn(whiteLabelService, 'delete').mockImplementation(() => {
        return whiteLabel;
      });

      const saveSpy = jest.spyOn(whiteLabelService, 'save').mockImplementation(async () => {
        return whiteLabel;
      });

      expect(await whiteLabelController.deleteWhiteLabelAction(req, 'alias')).toBe(undefined);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateWhiteLabelAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(whiteLabelController.updateWhiteLabelAction(req, new WhiteLabelDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a white label', async () => {
      const expectedResult = buildWhiteLabelWithId1();
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const updateSpy = jest.spyOn(whiteLabelService, 'update').mockImplementation(() => {
        return expectedResult;
      });

      const saveSpy = jest.spyOn(whiteLabelService, 'save').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await whiteLabelController.updateWhiteLabelAction(req, new WhiteLabelDto(), 'alias')).toEqual(expectedResult);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addTranslationToWhiteLabel', () => {
    it('should throw a not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(whiteLabelController.addTranslationToWhiteLabel(req, new WhiteLabelTranslationDto(), 'alias')).rejects.toThrow(NotFoundException);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an internal server error exception', async () => {
      const whiteLabel = buildWhiteLabelWithId1();

      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return whiteLabel;
      });

      const createWhiteLabelTranslationSpy = jest.spyOn(whiteLabelService, 'createWhiteLabelTranslation').mockImplementation(async () => {
        throw new InternalServerErrorException();
      });

      await expect(whiteLabelController.addTranslationToWhiteLabel(req, new WhiteLabelTranslationDto(), 'alias')).rejects.toThrow(InternalServerErrorException);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(createWhiteLabelTranslationSpy).toHaveBeenCalledTimes(1);
    });

    it('should call all necessary methods to add translation to white label', async () => {
      const whiteLabel = buildWhiteLabelWithId1();

      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return whiteLabel;
      });

      const createWhiteLabelTranslationSpy = jest.spyOn(whiteLabelService, 'createWhiteLabelTranslation').mockImplementation(async () => {
        return new WhiteLabelTranslation();
      });

      expect(await whiteLabelController.addTranslationToWhiteLabel(req, new WhiteLabelTranslationDto(), 'alias')).toBe(undefined);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(createWhiteLabelTranslationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('activeSectionAction', () => {
    it('should throw a not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(whiteLabelController.activeSectionAction(req, new ActiveWhiteLabelDto(), 'alias')).rejects.toThrow(NotFoundException);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a white label', async () => {
      const expectedResult = buildWhiteLabelWithId1();
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const activeSpy = jest.spyOn(whiteLabelService, 'active').mockImplementation(() => {
        return expectedResult;
      });

      const saveSpy = jest.spyOn(whiteLabelService, 'save').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await whiteLabelController.activeSectionAction(req, new ActiveWhiteLabelDto(), 'alias')).toEqual(expectedResult);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(activeSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
