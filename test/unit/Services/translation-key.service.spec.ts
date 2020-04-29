import { Test, TestingModule } from '@nestjs/testing';
import { TranslationKeyService } from '../../../src/Services/translation-key.service';
import { TranslationKeyRepository } from '../../../src/Repositories/translation-key.repository';
import { NotFoundException } from '@nestjs/common';
import { buildTranslationKeyArray, buildTranslationKeyWithId1 } from '../../helper/builder/translation-key.build';
import { TranslationKey } from '../../../src/Entities/translation-key.entity';

describe('TranslationKeyService', () => {
  let app: TestingModule;
  let translationKeyService: TranslationKeyService;
  let translationKeyRepository: TranslationKeyRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [TranslationKeyService, TranslationKeyRepository],
    }).compile();

    translationKeyService = app.get<TranslationKeyService>(
      TranslationKeyService,
    );
    translationKeyRepository = app.get<TranslationKeyRepository>(
      TranslationKeyRepository,
    );
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
          return buildTranslationKeyWithId1();
        });

      expect(
        await translationKeyService.getByTranslationKeyInApplication(
          1,
          1,
          'string',
        ),
      ).toEqual(buildTranslationKeyWithId1());
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
          return buildTranslationKeyWithId1();
        });

      expect(await translationKeyService.get(1, 1, 'translationKey')).toEqual(
        buildTranslationKeyWithId1(),
      );
      expect(findByTranslationKeyInApplicationSpy).toHaveBeenCalledTimes(1);
    });
  });
});
