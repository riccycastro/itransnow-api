import { Test, TestingModule } from '@nestjs/testing';
import { TranslationStatusService } from '../../../src/Services/translation-status.service';
import { TranslationStatusRepository } from '../../../src/Repositories/translation-status.repository';
import { NotFoundException } from '@nestjs/common';
import { buildTranslationStatus } from '../../helper/builder/translation-status.builder';

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
          return buildTranslationStatus();
        });

      expect(
        await translationStatusService.getByStatus('status_alias'),
      ).toEqual(buildTranslationStatus());
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTranslationStatusByTranslation', () => {
    it('should return a translation status', async () => {
      const findTranslationStatusSpy = jest.spyOn(translationStatusRepository, 'findTranslationStatus').mockImplementation(async () => {
        return buildTranslationStatus();
      });
      
      expect(await translationStatusService.getTranslationStatusByTranslation(
        1,
      )).toEqual(buildTranslationStatus());
      expect(findTranslationStatusSpy).toHaveBeenCalledTimes(1);
    });
  });
});
