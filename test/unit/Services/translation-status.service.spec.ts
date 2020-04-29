import { Test, TestingModule } from '@nestjs/testing';
import { TranslationStatusService } from '../../../src/Services/translation-status.service';
import { TranslationStatusRepository } from '../../../src/Repositories/translation-status.repository';
import { NotFoundException } from '@nestjs/common';
import { buildTranslationStatusWithId1 } from '../../helper/builder/translation-status.builder';

describe('TranslationStatusService', () => {
  let app: TestingModule;
  let translationStatusService: TranslationStatusService;
  let translationStatusRepository: TranslationStatusRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [TranslationStatusService, TranslationStatusRepository],
    }).compile();

    translationStatusService = app.get<TranslationStatusService>(
      TranslationStatusService,
    );
    translationStatusRepository = app.get<TranslationStatusRepository>(
      TranslationStatusRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByStatus', () => {
    it('should throw a not found exception error', async () => {
      const findOneSpy = jest
        .spyOn(translationStatusRepository, 'findOne')
        .mockImplementation(async () => {
          return undefined;
        });

      await expect(
        translationStatusService.getByStatus('status_alias'),
      ).rejects.toThrow(NotFoundException);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a translation status', async () => {
      const findOneSpy = jest
        .spyOn(translationStatusRepository, 'findOne')
        .mockImplementation(async () => {
          return buildTranslationStatusWithId1();
        });

      expect(
        await translationStatusService.getByStatus('status_alias'),
      ).toEqual(buildTranslationStatusWithId1());
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });
});
