import { Test, TestingModule } from '@nestjs/testing';
import { WhiteLabelService } from '../../../src/Services/white-label.service';
import { WhiteLabelRepository } from '../../../src/Repositories/white-label.repository';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { buildWhiteLabelArray, buildWhiteLabelWithId1 } from '../../helper/builder/white-label.builder';
import { ActiveWhiteLabelDto, WhiteLabelDto } from '../../../src/Dto/white-label.dto';
import { buildApplicationWithId1 } from '../../helper/builder/application.builder';
import { WhiteLabel } from '../../../src/Entities/white-label.entity';
import { utc as MomentUtc } from 'moment';
import { MomentProvider } from '../../../src/Services/Provider/moment.provider';
import { LanguageService } from '../../../src/Services/language.service';
import { buildLanguageWithId1 } from '../../helper/builder/language.builder';
import { TranslationStatusService } from '../../../src/Services/translation-status.service';
import { TranslationKeyService } from '../../../src/Services/translation-key.service';
import { TranslationService } from '../../../src/Services/translation.service';
import { buildTranslationStatusWithId1 } from '../../helper/builder/translation-status.builder';
import { buildTranslationKeyWithId1 } from '../../helper/builder/translation-key.build';
import { buildTranslationWithId1 } from '../../helper/builder/translation.builder';
import { QueryRunner } from '../../../src/Types/type';
import { QueryRunnerProvider } from '../../../src/Services/Provider/query-runner.provider';
import { WhiteLabelTranslationDto } from '../../../src/Dto/white-label-translation.dto';
import { User } from '../../../src/Entities/user.entity';
import { Translation } from '../../../src/Entities/translation.entity';
import {
  buildWhiteLabelTranslation,
  buildWhiteLabelTranslationWithId1,
} from '../../helper/builder/white-label-translation.build';

describe('WhiteLabelService', () => {
  let app: TestingModule;
  let whiteLabelService: WhiteLabelService;
  let whiteLabelRepository: WhiteLabelRepository;
  let languageService: LanguageService;
  let translationStatusService: TranslationStatusService;
  let translationKeyService: TranslationKeyService;
  let translationService: TranslationService;
  let queryRunnerProvider: QueryRunnerProvider;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        WhiteLabelService,
        WhiteLabelRepository,
        MomentProvider,
        LanguageService,
        TranslationStatusService,
        TranslationKeyService,
        TranslationService,
        QueryRunnerProvider,
        {
          provide: 'ApplicationService',
          useValue: {},
        },
        {
          provide: 'LanguageRepository',
          useValue: {},
        },
        {
          provide: 'TranslationStatusRepository',
          useValue: {},
        },
        {
          provide: 'TranslationKeyRepository',
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
      ],
    }).compile();

    whiteLabelService = app.get<WhiteLabelService>(WhiteLabelService);
    whiteLabelRepository = app.get<WhiteLabelRepository>(WhiteLabelRepository);
    languageService = app.get<LanguageService>(LanguageService);
    translationStatusService = app.get<TranslationStatusService>(TranslationStatusService);
    translationKeyService = app.get<TranslationKeyService>(TranslationKeyService);
    translationService = app.get<TranslationService>(TranslationService);
    queryRunnerProvider = app.get<QueryRunnerProvider>(QueryRunnerProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByAliasOrFail', () => {
    it('should throw a not found exception error', async () => {
      const findByAliasSpy = jest.spyOn(whiteLabelRepository, 'findByAlias').mockImplementation(async () => undefined);

      await expect(whiteLabelService.findByAliasOrFail(1, 'alias')).rejects.toThrow(NotFoundException);
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a white label', async () => {
      const findByAliasSpy = jest.spyOn(whiteLabelRepository, 'findByAlias').mockImplementation(async () => buildWhiteLabelWithId1());
      expect(await whiteLabelService.findByAliasOrFail(1, 'alias')).toEqual(buildWhiteLabelWithId1());
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByApplication', () => {
    it('should return an array of white labels', async () => {
      const findByApplicationSpy = jest.spyOn(whiteLabelRepository, 'findByApplication').mockImplementation(async () => {
        return buildWhiteLabelArray();
      });

      expect(await whiteLabelService.getByApplication(1, 1, {})).toEqual(buildWhiteLabelArray());
      expect(findByApplicationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should throw a bad request exception error', async () => {
      const findOneSpy = jest.spyOn(whiteLabelRepository, 'findOne').mockImplementation(async () => {
        return buildWhiteLabelWithId1();
      });

      const whiteLabelDto = new WhiteLabelDto();
      whiteLabelDto.alias = 'white label alias';

      await expect(whiteLabelService.create(whiteLabelDto, buildApplicationWithId1())).rejects.toThrow(BadRequestException);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the created white label', async () => {
      const findOneSpy = jest.spyOn(whiteLabelRepository, 'findOne').mockImplementation(async () => {
        return undefined;
      });

      const expectedResult = new WhiteLabel();
      expectedResult.name = 'new alias';
      expectedResult.alias = 'white_label_alias';
      expectedResult.application = buildApplicationWithId1();

      const whiteLabelDto = new WhiteLabelDto();
      whiteLabelDto.name = 'new alias';
      whiteLabelDto.alias = 'white label alias';
      expect(await whiteLabelService.create(whiteLabelDto, buildApplicationWithId1())).toEqual(expectedResult);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return the given white label with deletedAt value different from 0', () => {
      const expectedResult = buildWhiteLabelWithId1();
      expectedResult.deletedAt = MomentUtc().unix();

      expect(whiteLabelService.delete(buildWhiteLabelWithId1())).toEqual(expectedResult);
    });
  });

  describe('active', () => {
    it('should return an active white label', () => {
      const whiteLabelDto = new ActiveWhiteLabelDto();
      whiteLabelDto.isActive = true;

      const whiteLabel = buildWhiteLabelWithId1();
      whiteLabel.isActive = false;

      expect(whiteLabelService.active(whiteLabel, whiteLabelDto)).toEqual(buildWhiteLabelWithId1());
    });

    it('should return an inactive white label', () => {
      const whiteLabelDto = new ActiveWhiteLabelDto();
      whiteLabelDto.isActive = false;

      const expectedResult = buildWhiteLabelWithId1();
      expectedResult.isActive = false;

      expect(whiteLabelService.active(buildWhiteLabelWithId1(), whiteLabelDto)).toEqual(expectedResult);
    });
  });

  describe('createWhiteLabelTranslation', () => {
    it('should throw an internal server exception error on translationService save', async () => {
      const getByCodeInApplicationSpy = jest.spyOn(languageService, 'getByCodeInApplication').mockImplementation(async () => {
        return buildLanguageWithId1();
      });

      const getByStatusSpy = jest.spyOn(translationStatusService, 'getByStatus').mockImplementation(async () => {
        return buildTranslationStatusWithId1();
      });

      const getByTranslationKeyInApplicationSpy = jest.spyOn(translationKeyService, 'getByTranslationKeyInApplication').mockImplementation(async () => {
        return buildTranslationKeyWithId1();
      });

      const creatSpy = jest.spyOn(translationService, 'create').mockImplementation(() => {
        return buildTranslationWithId1();
      });

      const saveSpy = jest.spyOn(translationService, 'save').mockImplementation(async () => {
        throw new Error();
      });

      const createQueryRunnerSpy = jest.spyOn(queryRunnerProvider, 'createQueryRunner').mockImplementation(() => {
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

      await expect(whiteLabelService.createWhiteLabelTranslation(new User(), new WhiteLabel(), new WhiteLabelTranslationDto())).rejects.toThrow(InternalServerErrorException);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(creatSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an internal server exception error on whiteLabelTranslation save', async () => {
      const getByCodeInApplicationSpy = jest.spyOn(languageService, 'getByCodeInApplication').mockImplementation(async () => {
        return buildLanguageWithId1();
      });

      const getByStatusSpy = jest.spyOn(translationStatusService, 'getByStatus').mockImplementation(async () => {
        return buildTranslationStatusWithId1();
      });

      const getByTranslationKeyInApplicationSpy = jest.spyOn(translationKeyService, 'getByTranslationKeyInApplication').mockImplementation(async () => {
        return buildTranslationKeyWithId1();
      });

      const creatSpy = jest.spyOn(translationService, 'create').mockImplementation(() => {
        return buildTranslationWithId1();
      });

      const saveSpy = jest.spyOn(translationService, 'save').mockImplementation(async (translation: Translation) => {
        return translation;
      });

      const createQueryRunnerSpy = jest.spyOn(queryRunnerProvider, 'createQueryRunner').mockImplementation(() => {
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
          manager: {
            save: () => {
              throw new Error();
            },
          },
        } as unknown as QueryRunner;
      });

      await expect(whiteLabelService.createWhiteLabelTranslation(new User(), new WhiteLabel(), new WhiteLabelTranslationDto())).rejects.toThrow(InternalServerErrorException);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(creatSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the created white label translation', async () => {
      const getByCodeInApplicationSpy = jest.spyOn(languageService, 'getByCodeInApplication').mockImplementation(async () => {
        return buildLanguageWithId1();
      });

      const getByStatusSpy = jest.spyOn(translationStatusService, 'getByStatus').mockImplementation(async () => {
        return buildTranslationStatusWithId1();
      });

      const getByTranslationKeyInApplicationSpy = jest.spyOn(translationKeyService, 'getByTranslationKeyInApplication').mockImplementation(async () => {
        return buildTranslationKeyWithId1();
      });

      const creatSpy = jest.spyOn(translationService, 'create').mockImplementation(() => {
        return buildTranslationWithId1();
      });

      const saveSpy = jest.spyOn(translationService, 'save').mockImplementation(async (translation: Translation) => {
        return translation;
      });

      const createQueryRunnerSpy = jest.spyOn(queryRunnerProvider, 'createQueryRunner').mockImplementation(() => {
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
          manager: {
            save: () => {
              return buildWhiteLabelTranslationWithId1();
            },
          },
        } as unknown as QueryRunner;
      });

      expect(await whiteLabelService.createWhiteLabelTranslation(new User(), new WhiteLabel(), new WhiteLabelTranslationDto())).toEqual(buildWhiteLabelTranslationWithId1());
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(creatSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
    });
  });
});
