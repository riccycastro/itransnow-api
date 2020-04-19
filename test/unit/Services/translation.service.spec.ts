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
import { InternalServerErrorException } from '@nestjs/common';
import {
  buildTranslation,
  buildTranslationArray,
  buildTranslationArrayWhitTranslationKey,
  buildTranslationWithId1,
  buildTranslationWithTranslationKey,
} from '../../helper/builder/translation.builder';
import { buildApplicationWithId1 } from '../../helper/builder/application.builder';
import { buildLanguageWithId1 } from '../../helper/builder/language.builder';
import { WhiteLabelService } from '../../../src/Services/white-label.service';
import { buildTranslationKey, buildTranslationKeyWithId1 } from '../../helper/builder/translation-key.build';
import { buildWhiteLabelWithId1 } from '../../helper/builder/white-label.builder';

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
        {
          provide: 'ApplicationRepository',
          useValue: {},
        },
        {
          provide: 'SectionService',
          useValue: {},
        },
        {
          provide: 'MomentProvider',
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
    translationRepository = app.get<TranslationRepository>(TranslationRepository);
    applicationService = app.get<ApplicationService>(ApplicationService);
    translationStatusService = app.get<TranslationStatusService>(TranslationStatusService);
    languageService = app.get<LanguageService>(LanguageService);
    translationKeyService = app.get<TranslationKeyService>(TranslationKeyService);
    queryRunnerProvider = app.get<QueryRunnerProvider>(QueryRunnerProvider);
    whiteLabelService = app.get<WhiteLabelService>(WhiteLabelService);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return a new translation without translation key', () => {
      const expectedResult = new Translation();
      expectedResult.language = new Language();
      expectedResult.createdBy = new User();
      expectedResult.translationStatus = new TranslationStatus();
      expectedResult.translation = 'my translation';

      expect(translationService.create(new Language(), new User(), new TranslationStatus(), 'my translation')).toEqual(expectedResult);
    });

    it('should return a new translation with a translation key', () => {
      const expectedResult = new Translation();
      expectedResult.language = new Language();
      expectedResult.createdBy = new User();
      expectedResult.translationStatus = new TranslationStatus();
      expectedResult.translation = 'my translation';
      expectedResult.translationKey = new TranslationKey();

      expect(translationService.create(new Language(), new User(), new TranslationStatus(), 'my translation', new TranslationKey())).toEqual(expectedResult);
    });
  });

  describe('persist', () => {
    it('should throw an internal server error when saving translation key', async () => {
      const getByStatusSpy = jest.spyOn(translationStatusService, 'getByStatus').mockImplementation(async () => {
        return new TranslationStatus();
      });

      const getByCodeInApplicationSpy = jest.spyOn(languageService, 'getByCodeInApplication').mockImplementation(async () => {
        return new Language();
      });

      const getSpy = jest.spyOn(translationKeyService, 'get').mockImplementation(async () => {
        return new TranslationKey();
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

      const translationKeyServiceSaveSpy = jest.spyOn(translationKeyService, 'save').mockImplementation(async () => {
        throw new Error();
      });

      await expect(translationService.persist(new User, new Application(), new TranslationDto())).rejects.toThrow(InternalServerErrorException);

      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(translationKeyServiceSaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an internal server error when saving translation', async () => {

      const translationKey = new TranslationKey();

      const getByStatusSpy = jest.spyOn(translationStatusService, 'getByStatus').mockImplementation(async () => {
        return new TranslationStatus();
      });

      const getByCodeInApplicationSpy = jest.spyOn(languageService, 'getByCodeInApplication').mockImplementation(async () => {
        return new Language();
      });

      const getSpy = jest.spyOn(translationKeyService, 'get').mockImplementation(async () => {
        return translationKey;
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

      const translationKeyServiceSaveSpy = jest.spyOn(translationKeyService, 'save').mockImplementation(async () => {
        return translationKey;
      });

      const translationSaveSpy = jest.spyOn(translationService, 'save').mockImplementation(async () => {
        throw new Error();
      });

      await expect(translationService.persist(new User, new Application(), new TranslationDto())).rejects.toThrow(InternalServerErrorException);

      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(translationKeyServiceSaveSpy).toHaveBeenCalledTimes(1);
      expect(translationSaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the created translation', async () => {
      const translationKey = new TranslationKey();

      const getByStatusSpy = jest.spyOn(translationStatusService, 'getByStatus').mockImplementation(async () => {
        return new TranslationStatus();
      });

      const getByCodeInApplicationSpy = jest.spyOn(languageService, 'getByCodeInApplication').mockImplementation(async () => {
        return new Language();
      });

      const getSpy = jest.spyOn(translationKeyService, 'get').mockImplementation(async () => {
        return translationKey;
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
        } as QueryRunner;
      });

      const translationKeyServiceSaveSpy = jest.spyOn(translationKeyService, 'save').mockImplementation(async () => {
        return translationKey;
      });

      const translationSaveSpy = jest.spyOn(translationService, 'save').mockImplementation(async (translation: Translation) => {
        return translation;
      });

      const expectedResult = new Translation();
      expectedResult.language = new Language();
      expectedResult.createdBy = new User();
      expectedResult.translation = 'my translation';
      expectedResult.translationKey = translationKey;
      expectedResult.translationStatus = new TranslationStatus();

      const translationDto = new TranslationDto();
      translationDto.translation = 'my translation';
      expect(await translationService.persist(new User(), new Application(), translationDto)).toEqual(expectedResult);

      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(translationKeyServiceSaveSpy).toHaveBeenCalledTimes(1);
      expect(translationSaveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTranslationInApplicationByLanguage', () => {
    it('it should return an array of translation', async () => {
      const findTranslationInApplicationByLanguageSpy = jest.spyOn(translationRepository, 'findTranslationInApplicationByLanguage').mockImplementation(async () => {
        return buildTranslationArray();
      });

      expect(await translationService.getTranslationInApplicationByLanguage(1, 1, ['keys'], ['sections'])).toEqual(buildTranslationArray());
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTranslationInWhiteLabelByLanguage', () => {
    it('it should return an array of translation', async () => {
      const findTranslationInApplicationByLanguageSpy = jest.spyOn(translationRepository, 'findTranslationInWhiteLabelTranslationByLanguage').mockImplementation(async () => {
        return buildTranslationArray();
      });

      expect(await translationService.getTranslationInWhiteLabelByLanguage(1, 1, ['keys'], ['sections'])).toEqual(buildTranslationArray());
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTranslations', () => {
    it('should return default translation string result', async () => {
      const getApplicationByAliasOrFailSpy = jest.spyOn(applicationService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      const getByCodeInApplicationSpy = jest.spyOn(languageService, 'getByCodeInApplication').mockImplementation(async () => {
        return buildLanguageWithId1();
      });

      const findTranslationInApplicationByLanguageSpy = jest.spyOn(translationRepository, 'findTranslationInApplicationByLanguage').mockImplementation(async () => {
        return buildTranslationArrayWhitTranslationKey();
      });

      expect(await translationService.getTranslations(1, new TranslationDto())).toEqual('{"translation_key_alias_1":"translation_translation_1","translation_key_alias_2":"translation_translation_2","translation_key_alias_3":"translation_translation_3","translation_key_alias_4":"translation_translation_4","translation_key_alias_5":"translation_translation_5"}');
      expect(getApplicationByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(1);
    });

    it('should return nested translations string result', async () => {
      const getApplicationByAliasOrFailSpy = jest.spyOn(applicationService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      const getByCodeInApplicationSpy = jest.spyOn(languageService, 'getByCodeInApplication').mockImplementation(async () => {
        return buildLanguageWithId1();
      });

      const findTranslationInApplicationByLanguageSpy = jest.spyOn(translationRepository, 'findTranslationInApplicationByLanguage').mockImplementation(async () => {
        const translation = buildTranslationWithId1();
        const translation2 = buildTranslation(2);
        const translationKey = buildTranslationKeyWithId1();
        translationKey.alias = 'translationTest.' + translationKey.alias;
        translation.translationKey = translationKey;

        const translationKey2 = buildTranslationKey(2);
        translationKey2.alias = 'translationTest.' + translationKey2.alias;
        translation2.translationKey = translationKey2;

        return [translation, translation2];
      });

      const translationDto = new TranslationDto();
      translationDto.indexType = 'nested';
      expect(await translationService.getTranslations(1, translationDto)).toEqual('{"translationTest":{"translation_key_alias_1":"translation_translation_1","translation_key_alias_2":"translation_translation_2"}}');

      expect(getApplicationByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an YML translation string format', async () => {
      const getApplicationByAliasOrFailSpy = jest.spyOn(applicationService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      const getByCodeInApplicationSpy = jest.spyOn(languageService, 'getByCodeInApplication').mockImplementation(async () => {
        return buildLanguageWithId1();
      });

      const findTranslationInApplicationByLanguageSpy = jest.spyOn(translationRepository, 'findTranslationInApplicationByLanguage').mockImplementation(async () => {
        return buildTranslationArrayWhitTranslationKey();
      });

      const translationDto = new TranslationDto();
      translationDto.extension = '.yaml';

      expect(await translationService.getTranslations(1, translationDto)).toEqual('---\n' +
        '  translation_key_alias_1: "translation_translation_1"\n' +
        '  translation_key_alias_2: "translation_translation_2"\n' +
        '  translation_key_alias_3: "translation_translation_3"\n' +
        '  translation_key_alias_4: "translation_translation_4"\n' +
        '  translation_key_alias_5: "translation_translation_5"\n' +
        '');
      expect(getApplicationByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(1);
    });

    it('should override translation by white label translation', async () => {
      const getApplicationByAliasOrFailSpy = jest.spyOn(applicationService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      const getByCodeInApplicationSpy = jest.spyOn(languageService, 'getByCodeInApplication').mockImplementation(async () => {
        return buildLanguageWithId1();
      });

      const findTranslationInApplicationByLanguageSpy = jest.spyOn(translationRepository, 'findTranslationInApplicationByLanguage').mockImplementation(async () => {
        return [buildTranslationWithTranslationKey(1)];
      });

      const findTranslationInWhiteLabelTranslationByLanguageSpy = jest.spyOn(translationRepository, 'findTranslationInWhiteLabelTranslationByLanguage').mockImplementation(async () => {
        const translation = buildTranslationWithTranslationKey(1);
        translation.translation = 'white label Translation';
        return [translation];
      });

      const findWhiteLabelByAliasOrFail = jest.spyOn(whiteLabelService, 'findByAliasOrFail').mockImplementation(async () => {
        return buildWhiteLabelWithId1();
      });

      const translationDto = new TranslationDto();
      translationDto.whiteLabel = 'whiteLabelAlias';

      expect(await translationService.getTranslations(1, translationDto)).toEqual('{"translation_key_alias_1":"white label Translation"}');
      expect(getApplicationByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(findWhiteLabelByAliasOrFail).toHaveBeenCalledTimes(1);
      expect(getByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
      expect(findTranslationInWhiteLabelTranslationByLanguageSpy).toHaveBeenCalledTimes(1);
      expect(findTranslationInApplicationByLanguageSpy).toHaveBeenCalledTimes(1);
    });
  });
});
