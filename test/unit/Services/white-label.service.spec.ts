import { Test, TestingModule } from '@nestjs/testing';
import { WhiteLabelService } from '../../../src/Services/white-label.service';
import { WhiteLabelRepository } from '../../../src/Repositories/white-label.repository';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { buildWhitelabel, buildWhiteLabelArray } from '../../helper/builder/white-label.builder';
import { ActiveWhiteLabelDto, WhiteLabelDto } from '../../../src/Dto/white-label.dto';
import { buildApplication } from '../../helper/builder/application.builder';
import { WhiteLabel } from '../../../src/Entities/white-label.entity';
import { utc as MomentUtc } from 'moment';
import { MomentProvider } from '../../../src/Services/Provider/moment.provider';
import { LanguageService } from '../../../src/Services/language.service';
import { buildLanguage } from '../../helper/builder/language.builder';
import { TranslationStatusService } from '../../../src/Services/translation-status.service';
import { TranslationKeyService } from '../../../src/Services/translation-key.service';
import { TranslationService } from '../../../src/Services/translation.service';
import { buildTranslationStatus } from '../../helper/builder/translation-status.builder';
import { buildTranslationKey } from '../../helper/builder/translation-key.build';
import { buildTranslation } from '../../helper/builder/translation.builder';
import { QueryRunner } from '../../../src/Types/type';
import { QueryRunnerProvider } from '../../../src/Services/Provider/query-runner.provider';
import { WhiteLabelTranslationDto } from '../../../src/Dto/white-label-translation.dto';
import { User } from '../../../src/Entities/user.entity';
import { Translation } from '../../../src/Entities/translation.entity';
import { buildWhiteLabelTranslation } from '../../helper/builder/white-label-translation.build';
import { StringProvider } from '../../../src/Services/Provider/string.provider';

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
        StringProvider,
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
    translationStatusService = app.get<TranslationStatusService>(
      TranslationStatusService,
    );
    translationKeyService = app.get<TranslationKeyService>(
      TranslationKeyService,
    );
    translationService = app.get<TranslationService>(TranslationService);
    queryRunnerProvider = app.get<QueryRunnerProvider>(QueryRunnerProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByAliasOrFail', () => {
    it('should throw a not found exception error', async () => {
      const findByAliasSpy = jest
        .spyOn(whiteLabelRepository, 'findByAlias')
        .mockImplementation(async () => undefined);

      await expect(
        whiteLabelService.findByAliasOrFail(1, 'alias'),
      ).rejects.toThrow(NotFoundException);
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a white label', async () => {
      const findByAliasSpy = jest
        .spyOn(whiteLabelRepository, 'findByAlias')
        .mockImplementation(async () => buildWhitelabel());
      expect(await whiteLabelService.findByAliasOrFail(1, 'alias')).toEqual(
        buildWhitelabel(),
      );
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByApplication', () => {
    it('should return an array of white labels', async () => {
      const findByApplicationSpy = jest
        .spyOn(whiteLabelRepository, 'findByApplication')
        .mockImplementation(async () => {
          return buildWhiteLabelArray();
        });

      expect(await whiteLabelService.getByApplication(1, 1, {})).toEqual(
        buildWhiteLabelArray(),
      );
      expect(findByApplicationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should throw a bad request exception error', async () => {
      const findOneSpy = jest
        .spyOn(whiteLabelRepository, 'findOne')
        .mockImplementation(async () => {
          return buildWhitelabel();
        });

      const whiteLabelDto = new WhiteLabelDto();
      whiteLabelDto.alias = 'white label alias';

      await expect(
        whiteLabelService.create(whiteLabelDto, buildApplication()),
      ).rejects.toThrow(BadRequestException);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the created white label', async () => {
      const findOneSpy = jest
        .spyOn(whiteLabelRepository, 'findOne')
        .mockImplementation(async () => {
          return undefined;
        });

      const expectedResult = new WhiteLabel();
      expectedResult.name = 'new alias';
      expectedResult.alias = 'white_label_alias';
      expectedResult.application = buildApplication();

      const whiteLabelDto = new WhiteLabelDto();
      whiteLabelDto.name = 'new alias';
      whiteLabelDto.alias = 'white label alias';
      expect(
        await whiteLabelService.create(
          whiteLabelDto,
          buildApplication(),
        ),
      ).toEqual(expectedResult);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return the given white label with deletedAt value different from 0', () => {
      const expectedResult = buildWhitelabel();
      expectedResult.deletedAt = MomentUtc().unix();

      expect(whiteLabelService.delete(buildWhitelabel())).toEqual(
        expectedResult,
      );
    });
  });

  describe('active', () => {
    it('should return an active white label', () => {
      const whiteLabelDto = new ActiveWhiteLabelDto();
      whiteLabelDto.isActive = true;

      const whiteLabel = buildWhitelabel();
      whiteLabel.isActive = false;

      expect(whiteLabelService.active(whiteLabel, whiteLabelDto)).toEqual(
        buildWhitelabel(),
      );
    });

    it('should return an inactive white label', () => {
      const whiteLabelDto = new ActiveWhiteLabelDto();
      whiteLabelDto.isActive = false;

      const expectedResult = buildWhitelabel();
      expectedResult.isActive = false;

      expect(
        whiteLabelService.active(buildWhitelabel(), whiteLabelDto),
      ).toEqual(expectedResult);
    });
  });

  describe('createWhiteLabelTranslation', () => {
    it('should throw an internal server exception error on translationService save', async () => {
      const getByCodeInApplicationSpy = jest
        .spyOn(languageService, 'getByCodeInApplication')
        .mockImplementation(async () => {
          return buildLanguage();
        });

      const getByStatusSpy = jest
        .spyOn(translationStatusService, 'getByStatus')
        .mockImplementation(async () => {
          return buildTranslationStatus();
        });

      const getByTranslationKeyInApplicationSpy = jest
        .spyOn(translationKeyService, 'getByTranslationKeyInApplication')
        .mockImplementation(async () => {
          return buildTranslationKey();
        });

      const creatSpy = jest
        .spyOn(translationService, 'create')
        .mockImplementation(() => {
          return buildTranslation();
        });

      const saveSpy = jest
        .spyOn(translationService, 'save')
        .mockImplementation(async () => {
          throw new Error();
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

      await expect(
        whiteLabelService.createWhiteLabelTranslation(
          new User(),
          new WhiteLabel(),
          new WhiteLabelTranslationDto(),
        ),
      ).rejects.toThrow(InternalServerErrorException);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(creatSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an internal server exception error on whiteLabelTranslation save', async () => {
      const getByCodeInApplicationSpy = jest
        .spyOn(languageService, 'getByCodeInApplication')
        .mockImplementation(async () => {
          return buildLanguage();
        });

      const getByStatusSpy = jest
        .spyOn(translationStatusService, 'getByStatus')
        .mockImplementation(async () => {
          return buildTranslationStatus();
        });

      const getByTranslationKeyInApplicationSpy = jest
        .spyOn(translationKeyService, 'getByTranslationKeyInApplication')
        .mockImplementation(async () => {
          return buildTranslationKey();
        });

      const creatSpy = jest
        .spyOn(translationService, 'create')
        .mockImplementation(() => {
          return buildTranslation();
        });

      const saveSpy = jest
        .spyOn(translationService, 'save')
        .mockImplementation(async (translation: Translation) => {
          return translation;
        });

      const createQueryRunnerSpy = jest
        .spyOn(queryRunnerProvider, 'createQueryRunner')
        .mockImplementation(() => {
          return ({
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
          } as unknown) as QueryRunner;
        });

      await expect(
        whiteLabelService.createWhiteLabelTranslation(
          new User(),
          new WhiteLabel(),
          new WhiteLabelTranslationDto(),
        ),
      ).rejects.toThrow(InternalServerErrorException);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(creatSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the created white label translation', async () => {
      const getByCodeInApplicationSpy = jest
        .spyOn(languageService, 'getByCodeInApplication')
        .mockImplementation(async () => {
          return buildLanguage();
        });

      const getByStatusSpy = jest
        .spyOn(translationStatusService, 'getByStatus')
        .mockImplementation(async () => {
          return buildTranslationStatus();
        });

      const getByTranslationKeyInApplicationSpy = jest
        .spyOn(translationKeyService, 'getByTranslationKeyInApplication')
        .mockImplementation(async () => {
          return buildTranslationKey();
        });

      const creatSpy = jest
        .spyOn(translationService, 'create')
        .mockImplementation(() => {
          return buildTranslation();
        });

      const saveSpy = jest
        .spyOn(translationService, 'save')
        .mockImplementation(async (translation: Translation) => {
          return translation;
        });

      const createQueryRunnerSpy = jest
        .spyOn(queryRunnerProvider, 'createQueryRunner')
        .mockImplementation(() => {
          return ({
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
                return buildWhiteLabelTranslation();
              },
            },
          } as unknown) as QueryRunner;
        });

      expect(
        await whiteLabelService.createWhiteLabelTranslation(
          new User(),
          new WhiteLabel(),
          new WhiteLabelTranslationDto(),
        ),
      ).toEqual(buildWhiteLabelTranslation());
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(creatSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
    });
  });
});
