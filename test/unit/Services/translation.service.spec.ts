import { Test, TestingModule } from '@nestjs/testing';
import { TranslationService } from '../../../src/Services/translation.service';
import { ApplicationService } from '../../../src/Services/application.service';
import { TranslationRepository } from '../../../src/Repositories/translation.repository';
import { Language } from '../../../src/Entities/language.entity';
import { User } from '../../../src/Entities/user.entity';
import { TranslationStatus } from '../../../src/Entities/translation-status.entity';
import { Translation } from '../../../src/Entities/translation.entity';
import { TranslationKey } from '../../../src/Entities/translation-key.entity';
import { TranslationStatusService } from '../../../src/Services/translation-status.service';
import { LanguageService } from '../../../src/Services/language.service';
import { TranslationKeyService } from '../../../src/Services/translation-key.service';
import { QueryRunner } from '../../../src/Types/type';
import { QueryRunnerProvider } from '../../../src/Services/Provider/query-runner.provider';
import { Application } from '../../../src/Entities/application.entity';
import { TranslationDto } from '../../../src/Dto/translation.dto';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { buildTranslation, buildTranslationArray } from '../../helper/builder/translation.builder';
import { buildApplication } from '../../helper/builder/application.builder';
import { buildLanguage } from '../../helper/builder/language.builder';
import { WhiteLabelService } from '../../../src/Services/white-label.service';
import { buildWhitelabel } from '../../helper/builder/white-label.builder';
import { StringProvider } from '../../../src/Services/Provider/string.provider';
import { buildTranslationStatus } from '../../helper/builder/translation-status.builder';
import { utc as MomentUtc } from 'moment';
import { MomentProvider } from '../../../src/Services/Provider/moment.provider';
import {
  buildTranslationExportData,
  buildTranslationExportDataArray,
} from '../../helper/builder/translation-export-data.builder';

describe('TranslationService', () => {
  let app: TestingModule;
  let translationService: TranslationService;
  let translationRepository: TranslationRepository;
  let applicationService: ApplicationService;
  let translationStatusService: TranslationStatusService;
  let languageService: LanguageService;
  let translationKeyService: TranslationKeyService;
  let queryRunnerProvider: QueryRunnerProvider;
  let whiteLabelService: WhiteLabelService;
  let stringProvider: StringProvider;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        TranslationService,
        ApplicationService,
        TranslationStatusService,
        LanguageService,
        TranslationKeyService,
        QueryRunnerProvider,
        TranslationRepository,
        WhiteLabelService,
        StringProvider,
        MomentProvider,
        {
          provide: 'ApplicationRepository',
          useValue: {},
        },
        {
          provide: 'SectionService',
          useValue: {},
        },
        {
          provide: 'TranslationStatusRepository',
          useValue: {},
        },
        {
          provide: 'LanguageRepository',
          useValue: {},
        },
        {
          provide: 'TranslationKeyRepository',
          useValue: {},
        },
        {
          provide: 'Connection',
          useValue: {},
        },
        {
          provide: 'WhiteLabelRepository',
          useValue: {},
        },
      ],
    }).compile();

    translationService = app.get<TranslationService>(TranslationService);
    translationRepository = app.get<TranslationRepository>(
      TranslationRepository,
    );
    applicationService = app.get<ApplicationService>(ApplicationService);
    translationStatusService = app.get<TranslationStatusService>(
      TranslationStatusService,
    );
    languageService = app.get<LanguageService>(LanguageService);
    translationKeyService = app.get<TranslationKeyService>(
      TranslationKeyService,
    );
    queryRunnerProvider = app.get<QueryRunnerProvider>(QueryRunnerProvider);
    whiteLabelService = app.get<WhiteLabelService>(WhiteLabelService);
    stringProvider = app.get<StringProvider>(StringProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return a new translation without translation key', () => {
      const expectedResult = new Translation();
      expectedResult.alias = 'oucpzhxvzs';
      expectedResult.language = new Language();
      expectedResult.createdBy = new User();
      expectedResult.translation = 'my translation';
      expectedResult.translationKey = undefined;
      expectedResult.translationStatus = new TranslationStatus();

      const generateRandomStringWithLength10Spy = jest.spyOn(stringProvider, 'generateRandomStringWithLength10')
        .mockImplementation(() => {
          return 'oucpzhxvzs';
        });

      expect(
        translationService.create(
          new Language(),
          new User(),
          new TranslationStatus(),
          'my translation',
        ),
      ).toEqual(expectedResult);
      expect(generateRandomStringWithLength10Spy).toHaveBeenCalledTimes(1);
    });

    it('should return a new translation with a translation key', () => {
      const expectedResult = new Translation();
      expectedResult.alias = 'oucpzhxvzs';
      expectedResult.language = new Language();
      expectedResult.createdBy = new User();
      expectedResult.translationStatus = new TranslationStatus();
      expectedResult.translation = 'my translation';
      expectedResult.translationKey = new TranslationKey();

      const generateRandomStringWithLength10Spy = jest.spyOn(stringProvider, 'generateRandomStringWithLength10')
        .mockImplementation(() => {
          return 'oucpzhxvzs';
        });

      expect(
        translationService.create(
          new Language(),
          new User(),
          new TranslationStatus(),
          'my translation',
          new TranslationKey(),
        ),
      ).toEqual(expectedResult);
      expect(generateRandomStringWithLength10Spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('persist', () => {
    it('should throw an internal server error when saving translation key', async () => {
      const getByStatusSpy = jest
        .spyOn(translationStatusService, 'getByStatus')
        .mockImplementation(async () => {
          return new TranslationStatus();
        });

      const getByCodeInApplicationSpy = jest
        .spyOn(languageService, 'getByCodeInApplication')
        .mockImplementation(async () => {
          return new Language();
        });

      const getSpy = jest
        .spyOn(translationKeyService, 'get')
        .mockImplementation(async () => {
          return new TranslationKey();
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

      const translationKeyServiceSaveSpy = jest
        .spyOn(translationKeyService, 'save')
        .mockImplementation(async () => {
          throw new Error();
        });

      await expect(
        translationService.persist(
          new User(),
          new Application(),
          new TranslationDto(),
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(translationKeyServiceSaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an internal server error when saving translation', async () => {
      const translationKey = new TranslationKey();

      const getByStatusSpy = jest
        .spyOn(translationStatusService, 'getByStatus')
        .mockImplementation(async () => {
          return new TranslationStatus();
        });

      const getByCodeInApplicationSpy = jest
        .spyOn(languageService, 'getByCodeInApplication')
        .mockImplementation(async () => {
          return new Language();
        });

      const getSpy = jest
        .spyOn(translationKeyService, 'get')
        .mockImplementation(async () => {
          return translationKey;
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

      const translationKeyServiceSaveSpy = jest
        .spyOn(translationKeyService, 'save')
        .mockImplementation(async () => {
          return translationKey;
        });

      const translationSaveSpy = jest
        .spyOn(translationService, 'save')
        .mockImplementation(async () => {
          throw new Error();
        });

      await expect(
        translationService.persist(
          new User(),
          new Application(),
          new TranslationDto(),
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(translationKeyServiceSaveSpy).toHaveBeenCalledTimes(1);
      expect(translationSaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the created translation', async () => {
      const translationKey = new TranslationKey();

      const getByStatusSpy = jest
        .spyOn(translationStatusService, 'getByStatus')
        .mockImplementation(async () => {
          return new TranslationStatus();
        });

      const getByCodeInApplicationSpy = jest
        .spyOn(languageService, 'getByCodeInApplication')
        .mockImplementation(async () => {
          return new Language();
        });

      const getSpy = jest
        .spyOn(translationKeyService, 'get')
        .mockImplementation(async () => {
          return translationKey;
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

      const translationKeyServiceSaveSpy = jest
        .spyOn(translationKeyService, 'save')
        .mockImplementation(async () => {
          return translationKey;
        });

      const translationSaveSpy = jest
        .spyOn(translationService, 'save')
        .mockImplementation(async (translation: Translation) => {
          return translation;
        });

      const generateRandomStringWithLength10Spy = jest.spyOn(stringProvider, 'generateRandomStringWithLength10')
        .mockImplementation(() => {
          return 'oucpzhxvzs';
        });

      const expectedResult = new Translation();
      expectedResult.alias = 'oucpzhxvzs';
      expectedResult.language = new Language();
      expectedResult.createdBy = new User();
      expectedResult.translation = 'my translation';
      expectedResult.translationKey = translationKey;
      expectedResult.translationStatus = new TranslationStatus();

      const translationDto = new TranslationDto();
      translationDto.translation = 'my translation';
      expect(
        await translationService.persist(
          new User(),
          new Application(),
          translationDto,
        ),
      ).toEqual(expectedResult);

      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(translationKeyServiceSaveSpy).toHaveBeenCalledTimes(1);
      expect(translationSaveSpy).toHaveBeenCalledTimes(1);
      expect(generateRandomStringWithLength10Spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTranslationInApplicationByLanguage', () => {
    it('it should return an array of translation', async () => {
      const findTranslationInApplicationByLanguageSpy = jest
        .spyOn(translationRepository, 'findTranslationInApplicationByLanguage')
        .mockImplementation(async () => {
          return buildTranslationExportDataArray();
        });

      expect(
        await translationService.getTranslationInApplicationByLanguage(
          1,
          1,
          ['keys'],
          ['sections'],
        ),
      ).toEqual(buildTranslationExportDataArray());
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('getTranslations', () => {
    it('should return default translation string result', async () => {
      const getApplicationByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplication();
        });

      const getByCodeInApplicationSpy = jest
        .spyOn(languageService, 'getByCodeInApplication')
        .mockImplementation(async () => {
          return buildLanguage();
        });

      const findTranslationInApplicationByLanguageSpy = jest
        .spyOn(translationRepository, 'findTranslationInApplicationByLanguage')
        .mockImplementation(async () => {
          return buildTranslationExportDataArray();
        });

      expect(
        await translationService.getTranslations(1, new TranslationDto()),
      ).toEqual(
        '{"translation_translationKey_1":"translation_translation_1","translation_translationKey_2":"translation_translation_2","translation_translationKey_3":"translation_translation_3","translation_translationKey_4":"translation_translation_4","translation_translationKey_5":"translation_translation_5"}',
      );
      expect(getApplicationByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return nested translations string result', async () => {
      const getApplicationByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplication();
        });

      const getByCodeInApplicationSpy = jest
        .spyOn(languageService, 'getByCodeInApplication')
        .mockImplementation(async () => {
          return buildLanguage();
        });

      const findTranslationInApplicationByLanguageSpy = jest
        .spyOn(translationRepository, 'findTranslationInApplicationByLanguage')
        .mockImplementation(async () => {
          const translation = buildTranslationExportData({ translationKey: 'translationTest.translation_key_alias_1' });
          const translation2 = buildTranslationExportData({
            translation: 'translation_translation_2',
            translationKey: 'translationTest.translation_key_alias_2',
          });

          return [translation, translation2];
        });

      const translationDto = new TranslationDto();
      translationDto.indexType = 'nested';
      expect(
        await translationService.getTranslations(1, translationDto),
      ).toEqual(
        '{"translationTest":{"translation_key_alias_1":"translation_translation_1","translation_key_alias_2":"translation_translation_2"}}',
      );

      expect(getApplicationByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return an YML translation string format', async () => {
      const getApplicationByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplication();
        });

      const getByCodeInApplicationSpy = jest
        .spyOn(languageService, 'getByCodeInApplication')
        .mockImplementation(async () => {
          return buildLanguage();
        });

      const findTranslationInApplicationByLanguageSpy = jest
        .spyOn(translationRepository, 'findTranslationInApplicationByLanguage')
        .mockImplementation(async () => {
          return buildTranslationExportDataArray();
        });

      const translationDto = new TranslationDto();
      translationDto.extension = 'yaml';

      expect(
        await translationService.getTranslations(1, translationDto),
      ).toEqual(
        '---\n' +
        '  translation_translationKey_1: "translation_translation_1"\n' +
        '  translation_translationKey_2: "translation_translation_2"\n' +
        '  translation_translationKey_3: "translation_translation_3"\n' +
        '  translation_translationKey_4: "translation_translation_4"\n' +
        '  translation_translationKey_5: "translation_translation_5"\n' +
        '',
      );
      expect(getApplicationByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should override translation by white label translation', async () => {
      const getApplicationByAliasOrFailSpy = jest
        .spyOn(applicationService, 'getByAliasOrFail')
        .mockImplementation(async () => {
          return buildApplication();
        });

      const getByCodeInApplicationSpy = jest
        .spyOn(languageService, 'getByCodeInApplication')
        .mockImplementation(async () => {
          return buildLanguage();
        });

      let callCounter = 0;
      const findTranslationInApplicationByLanguageSpy = jest
        .spyOn(translationRepository, 'findTranslationInApplicationByLanguage')
        .mockImplementation(async () => {
          if (!callCounter) {
            callCounter++
            return [buildTranslationExportData({ translationKey: 'translation_key_alias_1' })];
          }

          return [buildTranslationExportData({ translationKey: 'translation_key_alias_1', translation: 'white label Translation' })];
        });

      const findWhiteLabelByAliasOrFail = jest
        .spyOn(whiteLabelService, 'findByAliasOrFail')
        .mockImplementation(async () => {
          return buildWhitelabel();
        });

      const translationDto = new TranslationDto();
      translationDto.whiteLabel = 'whiteLabelAlias';

      expect(
        await translationService.getTranslations(1, translationDto),
      ).toEqual('{"translation_key_alias_1":"white label Translation"}');
      expect(getApplicationByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(findWhiteLabelByAliasOrFail).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(
        2,
      );
    });
  });

  describe('getByAliasOrFail', () => {
    it('should throw a not found exception', async () => {
      const findOneSpy = jest.spyOn(translationRepository, 'findOne').mockImplementation(async () => {
        return undefined;
      });

      await expect(translationService.getByAliasOrFail(
        1,
        'translationAlias',
      )).rejects.toThrow(NotFoundException);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a translation', async () => {
      const findOneSpy = jest.spyOn(translationRepository, 'findOne').mockImplementation(async () => {
        return buildTranslation();
      });

      expect(await translationService.getByAliasOrFail(
        1,
        'translationAlias',
      )).toEqual(buildTranslation());
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a translation with translation status', async () => {
      const findOneSpy = jest.spyOn(translationRepository, 'findOne').mockImplementation(async () => {
        return buildTranslation();
      });

      const getTranslationStatusByTranslationSpy = jest.spyOn(translationStatusService, 'getTranslationStatusByTranslation').mockImplementation(async () => {
        return buildTranslationStatus();
      });

      const expectedResult = buildTranslation();
      expectedResult.translationStatus = buildTranslationStatus();

      expect(await translationService.getByAliasOrFail(
        1,
        'translationAlias',
        { includes: ['translationStatus'] },
      )).toEqual(expectedResult);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(getTranslationStatusByTranslationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return the deleted translation', () => {
      const expectedResult = buildTranslation();
      expectedResult.deletedAt = MomentUtc().unix();

      expect(translationService.delete(buildTranslation()))
        .toEqual(expectedResult);
    });
  });

  describe('getTranslationsWithLanguageAndStatusByTranslationKey', () => {
    it('should return an array of translations', async () => {
      const findTranslationsWithLanguageAndStatusSpy = jest.spyOn(translationRepository, 'findTranslationsWithLanguageAndStatus').mockImplementation(async () => {
        return buildTranslationArray();
      });

      expect(await translationService.getTranslationsWithLanguageAndStatusByTranslationKey(
        1,
        'whiteLabelAlias',
      )).toEqual(buildTranslationArray());
      expect(findTranslationsWithLanguageAndStatusSpy).toHaveBeenCalledTimes(1);
    });
  });
});
