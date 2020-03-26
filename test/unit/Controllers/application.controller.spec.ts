import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from '../../../src/Controllers/application.controller';
import { ApplicationService } from '../../../src/Services/application.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { buildApplication, buildApplicationWithId1 } from '../../helper/builder/application.builder';
import { ActiveApplicationDto, ApplicationDto } from '../../../src/Dto/application.dto';
import { SectionDto } from '../../../src/Dto/section.dto';
import { buildSectionWithApplication } from '../../helper/builder/section.builder';
import { LanguageToApplicationDto } from '../../../src/Dto/language.dto';
import { WhiteLabelDto } from '../../../src/Dto/white-label.dto';
import { buildWhiteLabelWithApplication } from '../../helper/builder/white-label.builder';
import { TranslationDto } from '../../../src/Dto/translation.dto';
import { buildTranslation } from '../../helper/builder/translation.builder';

describe('ApplicationController', () => {
  let app: TestingModule;
  let applicationController: ApplicationController;
  let applicationService: ApplicationService;
  let req: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        ApplicationService,
        {
          provide: 'ApplicationRepository',
          useValue: {},
        },
        {
          provide: 'LanguageService',
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
          provide: 'TranslationService',
          useValue: {},
        },
      ],
    }).compile();

    applicationController = app.get<ApplicationController>(ApplicationController);
    applicationService = app.get<ApplicationService>(ApplicationService);

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

  describe('getApplicationAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(applicationController.getApplicationAction(req, 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a new application', async () => {
      jest.clearAllMocks();
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      expect(await applicationController.getApplicationAction(req, 'alias')).toEqual(buildApplicationWithId1());
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getApplicationsAction', () => {
    it('should return a list of application with count', async () => {
      const expectedResponse = {
        data: [1, 2, 3, 4, 5].map(index => {
          return buildApplication(index);
        }),
        count: 5,
      };

      const findInListSpy = jest.spyOn(applicationService, 'findInList').mockImplementation(async () => {
        return expectedResponse;
      });

      expect(await applicationController.getApplicationsAction(req)).toEqual(expectedResponse);
      expect(findInListSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an empty list of application with count equal 0', async () => {
      const expectedResponse = { data: [], count: 0 };

      const findInListSpy = jest.spyOn(applicationService, 'findInList').mockImplementation(async () => {
        return expectedResponse;
      });

      expect(await applicationController.getApplicationsAction(req)).toEqual(expectedResponse);
      expect(findInListSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('createApplicationAction', () => {
    it('should throw a conflict exception', async () => {
      const createSpy = jest.spyOn(applicationService, 'create').mockImplementation(async () => {
        throw new ConflictException();
      });

      await expect(applicationController.createApplicationAction({
        name: 'name',
        alias: 'alias',
      }, req)).rejects.toThrow();
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('should return undefine and call create and save methods', async () => {
      const expectedResponse = buildApplicationWithId1();
      const createSpy = jest.spyOn(applicationService, 'create').mockImplementation(async () => {
        return expectedResponse;
      });

      const saveSpy = jest.spyOn(applicationService, 'save').mockImplementation(async () => {
        return expectedResponse;
      });

      expect(await applicationController.createApplicationAction({
        name: 'name',
        alias: 'alias',
      }, req)).toEqual(undefined);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteApplicationAction', () => {
    it('should call all necessary methods to delete application', async () => {
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(applicationController.deleteApplicationAction(req, 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should save delete operation', async () => {
      const expectedResult = buildApplicationWithId1();
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const deleteSpy = jest.spyOn(applicationService, 'delete');

      expect(await applicationController.deleteApplicationAction(req, 'alias')).toBe(undefined);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateApplicationAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(applicationController.updateApplicationAction(req, new ApplicationDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return application if success', async () => {
      const expectedResult = buildApplicationWithId1();
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const updateSpy = jest.spyOn(applicationService, 'update').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await applicationController.updateApplicationAction(req, new ApplicationDto(), 'alias')).toEqual(expectedResult);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('activeApplicationAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(applicationController.activeApplicationAction(req, new ActiveApplicationDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return activated application', async () => {
      const expectedResult = buildApplicationWithId1();
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const activeSpy = jest.spyOn(applicationService, 'active').mockImplementation(() => {
        return expectedResult;
      });

      const saveSpy = jest.spyOn(applicationService, 'save').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await applicationController.activeApplicationAction(req, new ActiveApplicationDto(), 'alias')).toEqual(expectedResult);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(activeSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addSectionToApplicationAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(applicationController.addSectionToApplicationAction(req, new SectionDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return created section', async () => {
      const section = buildSectionWithApplication(1, 1);

      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        return section.application;
      });

      const createSectionSpy = jest.spyOn(applicationService, 'createSection').mockImplementation(async () => {
        return section;
      });

      section.application = undefined;

      expect(await applicationController.addSectionToApplicationAction(req, new SectionDto(), 'alias')).toEqual(section);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(createSectionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addLanguageToApplicationAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(applicationController.addLanguageToApplicationAction(req, new LanguageToApplicationDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return application', async () => {
      const expectedResult = buildApplicationWithId1();
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const addLanguagesSpy = jest.spyOn(applicationService, 'addLanguages').mockImplementation(async () => {
        return expectedResult;
      });

      const saveSpy = jest.spyOn(applicationService, 'save').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await applicationController.addLanguageToApplicationAction(req, new LanguageToApplicationDto(), 'alias')).toEqual(expectedResult);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(addLanguagesSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeLanguageFromApplicationAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(applicationController.removeLanguageFromApplicationAction(req, new LanguageToApplicationDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return application', async () => {
      const expectedResult = buildApplicationWithId1();
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const removeLanguagesSpy = jest.spyOn(applicationService, 'removeLanguages').mockImplementation(async () => {
        return expectedResult;
      });

      const saveSpy = jest.spyOn(applicationService, 'save').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await applicationController.removeLanguageFromApplicationAction(req, new LanguageToApplicationDto(), 'alias')).toEqual(expectedResult);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(removeLanguagesSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addWhiteLabelToApplicationAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(applicationController.addWhiteLabelToApplicationAction(req, new WhiteLabelDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a white label', async () => {
      const whiteLabel = buildWhiteLabelWithApplication(1, 1);

      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        return whiteLabel.application;
      });

      const createWhiteLabelSpy = jest.spyOn(applicationService, 'createWhiteLabel').mockImplementation(async () => {
        return whiteLabel;
      });

      whiteLabel.application = undefined;

      expect(await applicationController.addWhiteLabelToApplicationAction(req, new WhiteLabelDto(), 'alias')).toEqual(whiteLabel);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(createWhiteLabelSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addTranslationToApplicationAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(applicationController.addTranslationToApplicationAction(req, new TranslationDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should call createTranslation method', async () => {
      const findByAliasOrFailSpy = jest.spyOn(applicationService, 'findByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      const createTranslationSpy = jest.spyOn(applicationService, 'createTranslation').mockImplementation(async () => {
        return buildTranslation(1);
      });

      expect(await applicationController.addTranslationToApplicationAction(req, new TranslationDto(), 'alias')).toEqual(undefined);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(createTranslationSpy).toHaveBeenCalledTimes(1);
    });
  });
});

















