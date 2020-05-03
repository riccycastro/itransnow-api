import { Test, TestingModule } from '@nestjs/testing';
import { LanguageService } from '../../../src/Services/language.service';
import { LanguageRepository } from '../../../src/Repositories/language.repository';
import { buildLanguage, buildLanguageArray } from '../../helper/builder/language.builder';
import { NotFoundException } from '@nestjs/common';

describe('LanguageService', () => {
  let app: TestingModule;
  let languageService: LanguageService;
  let languageRepository: LanguageRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [LanguageService, LanguageRepository],
    }).compile();

    languageService = app.get<LanguageService>(LanguageService);
    languageRepository = app.get<LanguageRepository>(LanguageRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByApplication', () => {
    it('should return an array of languages', async () => {
      const expectedResult = buildLanguageArray();

      const findByApplicationSpy = jest
        .spyOn(languageRepository, 'findByApplication')
        .mockImplementation(async () => {
          return buildLanguageArray();
        });

      expect(await languageService.getByApplication(1, 1, {})).toEqual(
        expectedResult,
      );
      expect(findByApplicationSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array', async () => {
      const findByApplicationSpy = jest
        .spyOn(languageRepository, 'findByApplication')
        .mockImplementation(async () => {
          return [];
        });

      expect(await languageService.getByApplication(1, 1, {})).toEqual([]);
      expect(findByApplicationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByCodes', () => {
    it('should return an array of languages', async () => {
      const findSpy = jest
        .spyOn(languageRepository, 'find')
        .mockImplementation(async () => {
          return buildLanguageArray();
        });

      expect(await languageService.getByCodes([])).toEqual(
        buildLanguageArray(),
      );
      expect(findSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array', async () => {
      const findSpy = jest
        .spyOn(languageRepository, 'find')
        .mockImplementation(async () => {
          return [];
        });
      expect(await languageService.getByCodes([])).toEqual([]);
      expect(findSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByCodeInApplication', () => {
    it('should throw a not found exception', async () => {
      const findByCodeInApplicationSpy = jest
        .spyOn(languageRepository, 'findByCodeInApplication')
        .mockImplementation(async () => {
          return undefined;
        });

      await expect(
        languageService.getByCodeInApplication(1, ''),
      ).rejects.toThrow(NotFoundException);
      expect(findByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a language', async () => {
      const expectedResult = buildLanguage();

      const findByCodeInApplicationSpy = jest
        .spyOn(languageRepository, 'findByCodeInApplication')
        .mockImplementation(async () => {
          return buildLanguage();
        });

      expect(await languageService.getByCodeInApplication(1, 'en')).toEqual(
        expectedResult,
      );
      expect(findByCodeInApplicationSpy).toHaveBeenCalledTimes(1);
    });
  });
});
