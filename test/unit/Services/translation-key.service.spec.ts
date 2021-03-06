import { Test, TestingModule } from '@nestjs/testing';
import { TranslationKeyService } from '../../../src/Services/translation-key.service';
import { TranslationKeyRepository } from '../../../src/Repositories/translation-key.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { buildTranslationKey, buildTranslationKeyArray } from '../../helper/builder/translation-key.build';
import { TranslationKey } from '../../../src/Entities/translation-key.entity';
import { MomentProvider } from '../../../src/Services/Provider/moment.provider';
import { buildTranslation, buildTranslationArray } from '../../helper/builder/translation.builder';
import { TranslationService } from '../../../src/Services/translation.service';
import { utc as MomentUtc } from 'moment';
import { buildTranslationStatus } from '../../helper/builder/translation-status.builder';
import { TranslationStatusService } from '../../../src/Services/translation-status.service';
import { TranslationStatusDto } from '../../../src/Dto/translation.dto';

describe('TranslationKeyService', () => {
  let app: TestingModule;
  let translationKeyService: TranslationKeyService;
  let translationKeyRepository: TranslationKeyRepository;
  let translationService: TranslationService;
  let translationStatusService: TranslationStatusService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        TranslationKeyService,
        TranslationKeyRepository,
        MomentProvider,
        TranslationService,
        TranslationStatusService,
        {
          provide: 'TranslationStatusRepository',
          useValue: {},
        },
        {
          provide: 'ApplicationService',
          useValue: {},
        },
        {
          provide: 'WhiteLabelService',
          useValue: {},
        },
        {
          provide: 'TranslationRepository',
          useValue: {},
        },
        {
          provide: 'LanguageService',
          useValue: {},
        },
        {
          provide: 'QueryRunnerProvider',
          useValue: {},
        },
        {
          provide: 'StringProvider',
          useValue: {},
        },
      ],
    }).compile();

    translationKeyService = app.get<TranslationKeyService>(
      TranslationKeyService,
    );
    translationKeyRepository = app.get<TranslationKeyRepository>(
      TranslationKeyRepository,
    );
    translationService = app.get<TranslationService>(TranslationService);
    translationStatusService = app.get<TranslationStatusService>(TranslationStatusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByTranslationKeyInApplication', () => {
    it('should throw a not found exception error', async () => {
      const findByTranslationKeyInApplicationSpy = jest
        .spyOn(translationKeyRepository, 'findByTranslationKeyInApplication')
        .mockImplementation(async () => {
          return undefined;
        });

      await expect(
        translationKeyService.getByTranslationKeyInApplication(1, 1, 'string'),
      ).rejects.toThrow(NotFoundException);
      expect(findByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a transaltion key', async () => {
      const findByTranslationKeyInApplicationSpy = jest
        .spyOn(translationKeyRepository, 'findByTranslationKeyInApplication')
        .mockImplementation(async () => {
          return buildTranslationKey();
        });

      expect(
        await translationKeyService.getByTranslationKeyInApplication(
          1,
          1,
          'string',
        ),
      ).toEqual(buildTranslationKey());
      expect(findByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByTranslationKeys', () => {
    it('should return a translation key array', async () => {
      const findByTranslationKeysInApplicationSpy = jest
        .spyOn(translationKeyRepository, 'findByTranslationKeysInApplication')
        .mockImplementation(async () => {
          return buildTranslationKeyArray();
        });

      expect(
        await translationKeyService.getByTranslationKeys(1, ['keys']),
      ).toEqual(buildTranslationKeyArray());
      expect(findByTranslationKeysInApplicationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    it('should return a new translation key', async () => {
      const findByTranslationKeyInApplicationSpy = jest
        .spyOn(translationKeyRepository, 'findByTranslationKeyInApplication')
        .mockImplementation(async () => {
          return undefined;
        });
      const expectedResult = new TranslationKey();
      expectedResult.alias = 'translationKey';

      expect(await translationKeyService.get(1, 1, 'translationKey')).toEqual(
        expectedResult,
      );
      expect(findByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
    });

    it('should return retrieved translation key', async () => {
      const findByTranslationKeyInApplicationSpy = jest
        .spyOn(translationKeyRepository, 'findByTranslationKeyInApplication')
        .mockImplementation(async () => {
          return buildTranslationKey();
        });

      expect(await translationKeyService.get(1, 1, 'translationKey')).toEqual(
        buildTranslationKey(),
      );
      expect(findByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByAliasOrFail', () => {
    it('should throw a not found exception', async () => {
      const findByAliasSpy = jest.spyOn(translationKeyRepository, 'findByAlias').mockImplementation(async () => {
        return undefined;
      });

      await expect(translationKeyService.getByAliasOrFail(
        1,
        'translationKeyAlias',
      )).rejects.toThrow(NotFoundException);
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a translation key', async () => {
      const findByAliasSpy = jest.spyOn(translationKeyRepository, 'findByAlias').mockImplementation(async () => {
        return buildTranslationKey();
      });

      expect(await translationKeyService.getByAliasOrFail(
        1,
        'translationKeyAlias',
      )).toEqual(buildTranslationKey());
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a translation key with translations', async () => {
      const findByAliasSpy = jest.spyOn(translationKeyRepository, 'findByAlias').mockImplementation(async () => {
        return buildTranslationKey();
      });

      const getTranslationsWithLanguageAndStatusByTranslationKeySpy = jest.spyOn(translationService, 'getTranslationsWithLanguageAndStatusByTranslationKey').mockImplementation(async () => {
        return buildTranslationArray();
      });

      const expectedResult = buildTranslationKey();
      expectedResult.translations = buildTranslationArray();

      expect(await translationKeyService.getByAliasOrFail(
        1,
        'translationKeyAlias',
        { includes: ['translations'] },
      )).toEqual(expectedResult);
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
      expect(getTranslationsWithLanguageAndStatusByTranslationKeySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return the deleted translation key', async () => {
      const expectedResult = buildTranslationKey();
      expectedResult.deletedAt = MomentUtc().unix();

      expect(await translationKeyService.delete(buildTranslationKey()))
        .toEqual(expectedResult);
    });
  });

  describe('deleteTranslation', () => {
    it('should return the deleted translation', async () => {
      const getByAliasOrFailSpy = jest.spyOn(translationService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildTranslation();
      });

      const deleteSpy = jest.spyOn(translationService, 'delete').mockImplementation((translation) => {
        return translation;
      });

      const saveSpy = jest.spyOn(translationService, 'save').mockImplementation(async (translation) => {
        return translation;
      });

      expect(await translationKeyService.deleteTranslation(
        buildTranslationKey(),
        'translationAlias',
      )).toEqual(buildTranslation());
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('statusTranslation', () => {
    it('should throw a bad request exception', async () => {
      const getByStatusSpy = jest.spyOn(translationStatusService, 'getByStatus').mockImplementation(async () => {
        const translationStatus = buildTranslationStatus();
        translationStatus.status = 'deprecated';
        return translationStatus;
      });

      const getByAliasOrFailSpy = jest.spyOn(translationService, 'getByAliasOrFail').mockImplementation(async () => {
        const translation = buildTranslation();
        const translationStatus = buildTranslationStatus();
        translationStatus.status = 'approval_pending';
        translation.translationStatus = translationStatus;
        return translation;
      });

      const translationStatusDto = new TranslationStatusDto();
      translationStatusDto.status = '';

      await expect(translationKeyService.statusTranslation(
        buildTranslationKey(),
        'translationAlias',
        translationStatusDto,
      )).rejects.toThrow(BadRequestException);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the updated translation', async () => {
      const getByStatusSpy = jest.spyOn(translationStatusService, 'getByStatus').mockImplementation(async () => {
        const translationStatus = buildTranslationStatus();
        translationStatus.status = 'approved';
        return translationStatus;
      });

      const getByAliasOrFailSpy = jest.spyOn(translationService, 'getByAliasOrFail').mockImplementation(async () => {
        const translation = buildTranslation();
        const translationStatus = buildTranslationStatus();
        translationStatus.status = 'approval_pending';
        translation.translationStatus = translationStatus;
        return translation;
      });

      const saveSpy = jest.spyOn(translationService, 'save').mockImplementation(async (translation) => {
        return translation;
      });

      const translationStatusDto = new TranslationStatusDto();
      translationStatusDto.status = '';

      const expectedResult = buildTranslation();
      const translationStatus = buildTranslationStatus();
      translationStatus.status = 'approved';
      expectedResult.translationStatus = translationStatus;

      expect(await translationKeyService.statusTranslation(
        buildTranslationKey(),
        'translationAlias',
        translationStatusDto,
      )).toEqual(expectedResult);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(getByStatusSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });
});
