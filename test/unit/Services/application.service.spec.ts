import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from '../../../src/Services/application.service';
import { ApplicationRepository } from '../../../src/Repositories/application.repository';
import { Application } from '../../../src/Entities/application.entity';
import { ActiveApplicationDto, ApplicationDto } from '../../../src/Dto/application.dto';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LanguageService } from '../../../src/Services/language.service';
import { SectionService } from '../../../src/Services/section.service';
import { WhiteLabelService } from '../../../src/Services/white-label.service';
import { buildApplicationArray, buildApplicationWithId1 } from '../../helper/builder/application.builder';
import { buildLanguageWithId1 } from '../../helper/builder/language.builder';
import { buildSectionWithId1 } from '../../helper/builder/section.builder';
import { buildWhiteLabelArray, buildWhiteLabelWithId1 } from '../../helper/builder/white-label.builder';
import { MomentProvider } from '../../../src/Services/Provider/moment.provider';
import { utc as MomentUtc } from 'moment';
import { SectionDto } from '../../../src/Dto/section.dto';
import { ActiveWhiteLabelDto, WhiteLabelDto } from '../../../src/Dto/white-label.dto';
import { TranslationService } from '../../../src/Services/translation.service';
import { User } from '../../../src/Entities/user.entity';
import { TranslationDto } from '../../../src/Dto/translation.dto';
import { buildTranslationWithId1 } from '../../helper/builder/translation.builder';
import { QueryRunnerProvider } from '../../../src/Services/Provider/query-runner.provider';
import { QueryRunner } from '../../../src/Types/type';
import { LanguageToApplicationDto } from '../../../src/Dto/language.dto';
import { classToClass } from 'class-transformer';
import { StringProvider } from '../../../src/Services/Provider/string.provider';
import { buildTranslationKeyArray, buildTranslationKeyWithId1 } from '../../helper/builder/translation-key.build';
import { TranslationKeyService } from '../../../src/Services/translation-key.service';
import { buildWhiteLabelTranslationWithId1 } from '../../helper/builder/white-label-translation.build';
import { WhiteLabelTranslationDto } from '../../../src/Dto/white-label-translation.dto';

describe('ApplicationService', () => {
  let app: TestingModule;
  let applicationService: ApplicationService;
  let applicationRepository: ApplicationRepository;
  let languageService: LanguageService;
  let sectionService: SectionService;
  let whiteLabelService: WhiteLabelService;
  let translationService: TranslationService;
  let queryRunnerProvider: QueryRunnerProvider;
  let translationKeyService: TranslationKeyService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        ApplicationService,
        ApplicationRepository,
        LanguageService,
        SectionService,
        WhiteLabelService,
        MomentProvider,
        TranslationService,
        QueryRunnerProvider,
        StringProvider,
        TranslationKeyService,
        {
          provide: 'LanguageRepository',
          useValue: {},
        },
        {
          provide: 'SectionRepository',
          useValue: {},
        },
        {
          provide: 'WhiteLabelRepository',
          useValue: {},
        },
        {
          provide: 'TranslationStatusService',
          useValue: {},
        },
        {
          provide: 'TranslationRepository',
          useValue: {},
        },
        {
          provide: 'Connection',
          useValue: {},
        },
        {
          provide: 'TranslationKeyRepository',
          useValue: {},
        },
      ],
    }).compile();

    queryRunnerProvider = app.get<QueryRunnerProvider>(QueryRunnerProvider);
    applicationService = app.get<ApplicationService>(ApplicationService);
    applicationRepository = app.get<ApplicationRepository>(
      ApplicationRepository,
    );
    languageService = app.get<LanguageService>(LanguageService);
    sectionService = app.get<SectionService>(SectionService);
    whiteLabelService = app.get<WhiteLabelService>(WhiteLabelService);
    translationService = app.get<TranslationService>(TranslationService);
    translationKeyService = app.get<TranslationKeyService>(TranslationKeyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw conflict exception', async () => {
      const findByAliasSpy = jest
        .spyOn(applicationRepository, 'findOne')
        .mockImplementation(async () => {
          return new Application();
        });

      const application = new ApplicationDto();
      application.alias = 'alias';

      await expect(applicationService.create(application, 1)).rejects.toThrow(
        ConflictException,
      );
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });

    it('should create application from dto and return it', async () => {
      const findByAliasSpy = jest
        .spyOn(applicationRepository, 'findOne')
        .mockImplementation(async () => {
          return undefined;
        });

      const application = new Application();
      application.name = 'application_name_1';
      application.alias = 'application_alias_1';
      application.company = 1;

      const applicationDto = new ApplicationDto();
      applicationDto.alias = 'application_alias_1';
      applicationDto.name = 'application_name_1';

      expect(await applicationService.create(applicationDto, 1)).toEqual(
        application,
      );
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByAliasOrFail', () => {
    it('should throw not found exception', async () => {
      const findByAliasSpy = jest
        .spyOn(applicationRepository, 'findOne')
        .mockImplementation(async () => {
          return undefined;
        });

      await expect(
        applicationService.getByAliasOrFail(1, 'alias'),
      ).rejects.toThrow(NotFoundException);
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an application', async () => {
      const expectedResult = buildApplicationWithId1();
      const findByAliasSpy = jest
        .spyOn(applicationRepository, 'findOne')
        .mockImplementation(async () => {
          return expectedResult;
        });

      expect(await applicationService.getByAliasOrFail(1, 'alias')).toEqual(
        expectedResult,
      );
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an application with language', async () => {
      const application = buildApplicationWithId1();
      const findByAliasSpy = jest
        .spyOn(applicationRepository, 'findOne')
        .mockImplementation(async () => {
          return application;
        });

      const getLanguageByApplicationSpy = jest
        .spyOn(languageService, 'getByApplication')
        .mockImplementation(async () => {
          return [buildLanguageWithId1()];
        });

      const expectedResult = buildApplicationWithId1();
      expectedResult.languages = [buildLanguageWithId1()];

      expect(
        await applicationService.getByAliasOrFail(1, 'alias', {
          includes: ['languages'],
        }),
      ).toEqual(expectedResult);
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
      expect(getLanguageByApplicationSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an application with section', async () => {
      const application = buildApplicationWithId1();
      const findByAliasSpy = jest
        .spyOn(applicationRepository, 'findOne')
        .mockImplementation(async () => {
          return application;
        });

      const getSectionByApplicationSpy = jest
        .spyOn(sectionService, 'getByApplication')
        .mockImplementation(async () => {
          return [buildSectionWithId1()];
        });

      const expectedResult = buildApplicationWithId1();
      expectedResult.sections = [buildSectionWithId1()];

      expect(
        await applicationService.getByAliasOrFail(1, 'alias', {
          includes: ['sections'],
        }),
      ).toEqual(expectedResult);
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
      expect(getSectionByApplicationSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an application with white labels', async () => {
      const application = buildApplicationWithId1();
      const findByAliasSpy = jest
        .spyOn(applicationRepository, 'findOne')
        .mockImplementation(async () => {
          return application;
        });

      const getWhitelabelByApplicationSpy = jest
        .spyOn(whiteLabelService, 'getByApplication')
        .mockImplementation(async () => {
          return [buildWhiteLabelWithId1()];
        });

      const expectedResult = buildApplicationWithId1();
      expectedResult.whiteLabels = [buildWhiteLabelWithId1()];

      expect(
        await applicationService.getByAliasOrFail(1, 'alias', {
          includes: ['white-labels'],
        }),
      ).toEqual(expectedResult);
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
      expect(getWhitelabelByApplicationSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an application which includes white label, section and language', async () => {
      const application = buildApplicationWithId1();
      const findByAliasSpy = jest
        .spyOn(applicationRepository, 'findOne')
        .mockImplementation(async () => {
          return application;
        });

      const getLanguageByApplicationSpy = jest
        .spyOn(languageService, 'getByApplication')
        .mockImplementation(async () => {
          return [buildLanguageWithId1()];
        });

      const getSectionByApplicationSpy = jest
        .spyOn(sectionService, 'getByApplication')
        .mockImplementation(async () => {
          return [buildSectionWithId1()];
        });

      const getWhitelabelByApplicationSpy = jest
        .spyOn(whiteLabelService, 'getByApplication')
        .mockImplementation(async () => {
          return [buildWhiteLabelWithId1()];
        });

      const expectedResult = buildApplicationWithId1();
      expectedResult.languages = [buildLanguageWithId1()];
      expectedResult.sections = [buildSectionWithId1()];
      expectedResult.whiteLabels = [buildWhiteLabelWithId1()];

      expect(
        await applicationService.getByAliasOrFail(1, 'alias', {
          includes: ['white-labels', 'sections', 'languages'],
        }),
      ).toEqual(expectedResult);
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
      expect(getWhitelabelByApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getLanguageByApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getSectionByApplicationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return an application', async () => {
      const findOneSpy = jest
        .spyOn(applicationRepository, 'findOne')
        .mockImplementation(async () => {
          return new Application();
        });

      expect(await applicationService.getById(1)).toEqual(new Application());
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return an application with the properties set as deleted', async () => {
      const application = buildApplicationWithId1();

      const saveSpy = jest
        .spyOn(applicationRepository, 'save')
        .mockImplementation(async () => {
          return application;
        });

      const expectedResult = buildApplicationWithId1();
      expectedResult.isActive = false;
      expectedResult.deletedAt = MomentUtc().unix();

      expect(await applicationService.delete(application)).toEqual(
        expectedResult,
      );
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('active', () => {
    it('should return an inactive application', () => {
      const application = buildApplicationWithId1();

      const expectedResult = buildApplicationWithId1();
      expectedResult.isActive = false;

      const activeApplicationDto = new ActiveApplicationDto();
      activeApplicationDto.isActive = false;

      expect(
        applicationService.active(application, activeApplicationDto),
      ).toEqual(expectedResult);
    });

    it('should return an active application', () => {
      const application = buildApplicationWithId1();
      application.isActive = false;

      const expectedResult = buildApplicationWithId1();

      const activeApplicationDto = new ActiveApplicationDto();
      activeApplicationDto.isActive = true;

      expect(
        applicationService.active(application, activeApplicationDto),
      ).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should return an updated application', async () => {
      const application = buildApplicationWithId1();
      const saveSpy = jest
        .spyOn(applicationRepository, 'save')
        .mockImplementation(async () => {
          return application;
        });

      const applicationDto = new ApplicationDto();
      applicationDto.name = 'Castro app';

      const expectedResult = buildApplicationWithId1();
      expectedResult.name = 'Castro app';

      expect(
        await applicationService.update(application, applicationDto),
      ).toEqual(expectedResult);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('createSection', () => {
    it('should throw a bad request exception', async () => {
      const createSpy = jest
        .spyOn(sectionService, 'create')
        .mockImplementation(async () => {
          throw new BadRequestException();
        });

      await expect(
        applicationService.createSection(new Application(), new SectionDto()),
      ).rejects.toThrow(BadRequestException);
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a new section', async () => {
      const section = buildSectionWithId1();
      section.application = buildApplicationWithId1();

      const createSpy = jest
        .spyOn(sectionService, 'create')
        .mockImplementation(async () => {
          return section;
        });

      const spySave = jest
        .spyOn(sectionService, 'save')
        .mockImplementation(async () => {
          return section;
        });

      const expectedResult = buildSectionWithId1();
      expectedResult.application = buildApplicationWithId1();

      expect(
        await applicationService.createSection(
          buildApplicationWithId1(),
          new SectionDto(),
        ),
      ).toEqual(expectedResult);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(spySave).toHaveBeenCalledTimes(1);
    });
  });

  describe('createWhiteLabel', () => {
    it('should throw a bad request exception', async () => {
      const createSpy = jest
        .spyOn(whiteLabelService, 'create')
        .mockImplementation(async () => {
          throw new BadRequestException();
        });

      await expect(
        applicationService.createWhiteLabel(
          new Application(),
          new WhiteLabelDto(),
        ),
      ).rejects.toThrow(BadRequestException);
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a new white label', async () => {
      const whiteLabel = buildWhiteLabelWithId1();
      whiteLabel.application = buildApplicationWithId1();

      const createSpy = jest
        .spyOn(whiteLabelService, 'create')
        .mockImplementation(async () => {
          return whiteLabel;
        });

      const spySave = jest
        .spyOn(whiteLabelService, 'save')
        .mockImplementation(async () => {
          return whiteLabel;
        });

      const expectedResult = buildWhiteLabelWithId1();
      expectedResult.application = buildApplicationWithId1();

      expect(
        await applicationService.createWhiteLabel(
          buildApplicationWithId1(),
          new SectionDto(),
        ),
      ).toEqual(expectedResult);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(spySave).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTranslation', () => {
    it('should throw an internal server error exception', async () => {
      const persistSpy = jest
        .spyOn(translationService, 'persist')
        .mockImplementation(async () => {
          throw new InternalServerErrorException();
        });

      await expect(
        applicationService.createTranslation(
          new User(),
          new Application(),
          new TranslationDto(),
        ),
      ).rejects.toThrow(InternalServerErrorException);
      expect(persistSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a new translation', async () => {
      const translation = buildTranslationWithId1();

      const persistSpy = jest
        .spyOn(translationService, 'persist')
        .mockImplementation(async () => {
          return translation;
        });

      const expectResult = buildTranslationWithId1();

      expect(
        await applicationService.createTranslation(
          new User(),
          new Application(),
          new TranslationDto(),
        ),
      ).toEqual(expectResult);
      expect(persistSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addLanguages', () => {
    it('should throw a conflict exception', async () => {
      const getByCodesSpy = jest
        .spyOn(languageService, 'getByCodes')
        .mockImplementation(async () => {
          return [buildLanguageWithId1()];
        });

      const createQueryRunnerSpy = jest
        .spyOn(queryRunnerProvider, 'createQueryRunner')
        .mockImplementation(() => {
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

      const assignLanguageSpy = jest
        .spyOn(applicationRepository, 'assignLanguage')
        .mockImplementation(async () => {
          throw {
            code: 'ER_DUP_ENTRY',
            parameters: [1, 1],
          };
        });

      await expect(
        applicationService.addLanguages(
          new Application(),
          new LanguageToApplicationDto(),
        ),
      ).rejects.toThrow(ConflictException);
      expect(getByCodesSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(assignLanguageSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an internal server error exception', async () => {
      const getByCodesSpy = jest
        .spyOn(languageService, 'getByCodes')
        .mockImplementation(async () => {
          return [buildLanguageWithId1()];
        });

      const createQueryRunnerSpy = jest
        .spyOn(queryRunnerProvider, 'createQueryRunner')
        .mockImplementation(() => {
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

      const assignLanguageSpy = jest
        .spyOn(applicationRepository, 'assignLanguage')
        .mockImplementation(async () => {
          throw new Error();
        });

      await expect(
        applicationService.addLanguages(
          new Application(),
          new LanguageToApplicationDto(),
        ),
      ).rejects.toThrow(InternalServerErrorException);
      expect(getByCodesSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(assignLanguageSpy).toHaveBeenCalledTimes(1);
    });

    it('should return application with the new language', async () => {
      const getByCodesSpy = jest
        .spyOn(languageService, 'getByCodes')
        .mockImplementation(async () => {
          return [buildLanguageWithId1()];
        });

      const createQueryRunnerSpy = jest
        .spyOn(queryRunnerProvider, 'createQueryRunner')
        .mockImplementation(() => {
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

      const assignLanguageSpy = jest
        .spyOn(applicationRepository, 'assignLanguage')
        .mockImplementation(async () => {
          return;
        });

      const expectedResult = buildApplicationWithId1();
      expectedResult.languages.push(buildLanguageWithId1());

      expect(
        await applicationService.addLanguages(
          buildApplicationWithId1(),
          new LanguageToApplicationDto(),
        ),
      ).toEqual(expectedResult);
      expect(getByCodesSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(assignLanguageSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeLanguages', () => {
    it('should return an application', async () => {
      const getByCodesSpy = jest
        .spyOn(languageService, 'getByCodes')
        .mockImplementation(async () => {
          return [buildLanguageWithId1()];
        });

      const removeLanguageSpy = jest
        .spyOn(applicationRepository, 'removeLanguage')
        .mockImplementation(async () => {
          return;
        });

      expect(
        await applicationService.removeLanguages(
          new Application(),
          new LanguageToApplicationDto(),
        ),
      ).toEqual(new Application());
      expect(getByCodesSpy).toHaveBeenCalledTimes(1);
      expect(removeLanguageSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findInList', () => {
    it('should return find in list expected structure', async () => {
      const findByAliasSpy = jest
        .spyOn(applicationRepository, 'findInList')
        .mockImplementation(async () => {
          return [buildApplicationArray(), 5];
        });

      expect(await applicationService.findInList(1, {})).toEqual({
        data: classToClass(buildApplicationArray()),
        count: 5,
      });
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateWhiteLabel', () => {
    it('should return updated whiteLabel', async () => {
      const saveSpy = jest.spyOn(whiteLabelService, 'save').mockImplementation(async (whitelabel) => {
        return whitelabel;
      });

      const updateSpy = jest.spyOn(whiteLabelService, 'update').mockImplementation(async (whiteLabel) => {
        return whiteLabel;
      });

      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return buildWhiteLabelWithId1();
      });

      expect(await applicationService.updateWhiteLabel(
        buildApplicationWithId1(),
        new WhiteLabelDto(),
        'whiteLabelAlias',
      )).toEqual(buildWhiteLabelWithId1());
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getWhiteLabel', () => {
    it('should return a white label', async () => {
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return buildWhiteLabelWithId1();
      });

      expect(await applicationService.getWhiteLabel(
        buildApplicationWithId1(),
        'whitelabelAlias',
      )).toEqual(buildWhiteLabelWithId1());
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getWhiteLabels', () => {
    it('should return an array of white label', async () => {
      const findInListSpy = jest.spyOn(whiteLabelService, 'findInList').mockImplementation(async () => {
        return {
          data: buildWhiteLabelArray(),
          count: 5,
        };
      });

      expect(await applicationService.getWhiteLabels(
        buildApplicationWithId1(),
        {},
      )).toEqual({
          data: buildWhiteLabelArray(),
          count: 5,
        },
      );
      expect(findInListSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteWhiteLabel', () => {
    it('should return the deleted white label', async () => {
      const saveSpy = jest.spyOn(whiteLabelService, 'save').mockImplementation(async (whiteLabel) => {
        return whiteLabel;
      });

      const deleteSpy = jest.spyOn(whiteLabelService, 'delete').mockImplementation((whiteLabel) => {
        return whiteLabel;
      });

      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return buildWhiteLabelWithId1();
      });

      expect(await applicationService.deleteWhiteLabel(
        buildApplicationWithId1(),
        'whiteLabelAlias',
      )).toEqual(buildWhiteLabelWithId1());
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTranslationKey', () => {
    it('should return a translation key', async () => {
      const getByAliasOrFailSpy = jest.spyOn(translationKeyService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildTranslationKeyWithId1();
      });

      expect(await applicationService.getTranslationKey(
        buildApplicationWithId1(),
        'translationKeyAlias',
      )).toEqual(buildTranslationKeyWithId1());
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTranslationKeys', () => {
    it('should return an array of translation key', async () => {
      const findInListSpy = jest.spyOn(translationKeyService, 'findInList').mockImplementation(async () => {
        return {
          data: buildTranslationKeyArray(),
          count: 5,
        };
      });

      expect(await applicationService.getTranslationKeys(
        buildApplicationWithId1(),
        {},
      )).toEqual({
        data: buildTranslationKeyArray(),
        count: 5,
      });
      expect(findInListSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTranslationKey', () => {
    it('should return the deleted translation key', async () => {
      const saveSpy = jest.spyOn(translationKeyService, 'save').mockImplementation(async (translationKey) => {
        return translationKey;
      });

      const deleteSpy = jest.spyOn(translationKeyService, 'delete').mockImplementation((translationKey) => {
        return translationKey;
      });

      const findByAliasOrFailSpy = jest.spyOn(translationKeyService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildTranslationKeyWithId1();
      });

      expect(await applicationService.deleteTranslationKey(
        buildApplicationWithId1(),
        'translationKeyAlias',
      )).toEqual(buildTranslationKeyWithId1());
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addTranslationToWhiteLabel', () => {
    it('should return a white label translation', async () => {
      const findByAliasOrFailSpy = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return buildWhiteLabelWithId1();
      });

      const createWhiteLabelTranslationSpy = jest.spyOn(whiteLabelService, 'createWhiteLabelTranslation').mockImplementation(async () => {
        return buildWhiteLabelTranslationWithId1();
      });

      expect(await applicationService.addTranslationToWhiteLabel(
        new User(),
        buildApplicationWithId1(),
        'whiteLabelAlias',
        new WhiteLabelTranslationDto(),
      )).toEqual(buildWhiteLabelTranslationWithId1());
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(createWhiteLabelTranslationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('activeWhiteLabel', () => {
    it('should return an active white label', async () => {
      const saveSpy = jest.spyOn(whiteLabelService, 'save').mockImplementation(async (whiteLabel) => {
        return whiteLabel;
      });

      const activeSpy = jest.spyOn(whiteLabelService, 'active').mockImplementation(() => {
        const whiteLabel = buildWhiteLabelWithId1();
        whiteLabel.isActive = true;
        return whiteLabel;
      });

      const findByAliasOrFail = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return buildWhiteLabelWithId1();
      });

      expect(await applicationService.activeWhiteLabel(
        buildApplicationWithId1(),
        'whiteLabelAlias',
        new ActiveWhiteLabelDto(),
      )).toEqual(buildWhiteLabelWithId1());
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(activeSpy).toHaveBeenCalledTimes(1);
      expect(findByAliasOrFail).toHaveBeenCalledTimes(1);
    });

    it('should return an inactive white label', async () => {
      const saveSpy = jest.spyOn(whiteLabelService, 'save').mockImplementation(async (whiteLabel) => {
        return whiteLabel;
      });

      const activeSpy = jest.spyOn(whiteLabelService, 'active').mockImplementation(() => {
        const whiteLabel = buildWhiteLabelWithId1();
        whiteLabel.isActive = false;
        return whiteLabel;
      });

      const findByAliasOrFail = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return buildWhiteLabelWithId1();
      });

      const expectedResult = buildWhiteLabelWithId1();
      expectedResult.isActive = false;

      expect(await applicationService.activeWhiteLabel(
        buildApplicationWithId1(),
        'whiteLabelAlias',
        new ActiveWhiteLabelDto(),
      )).toEqual(expectedResult);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(activeSpy).toHaveBeenCalledTimes(1);
      expect(findByAliasOrFail).toHaveBeenCalledTimes(1);
    });
  });
});
