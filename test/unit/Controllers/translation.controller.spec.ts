import { Test, TestingModule } from '@nestjs/testing';
import { TranslationService } from '../../../src/Services/translation.service';
import { TranslationController } from '../../../src/Controllers/translation.controller';
import { TranslationDto } from '../../../src/Dto/translation.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { createRequest } from 'node-mocks-http';

describe('TranslationController', () => {
  let app: TestingModule;
  let translationController: TranslationController;
  let translationService: TranslationService;
  let req: any = {};
  let res: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TranslationController],
      providers: [
        TranslationService,
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
          provide: 'TranslationKeyService',
          useValue: {},
        },
        {
          provide: 'TranslationStatusService',
          useValue: {},
        },
        {
          provide: 'QueryRunnerProvider',
          useValue: {},
        },
        {
          provide: 'MomentProvider',
          useValue: {},
        },
      ],
    }).compile();

    translationController = app.get<TranslationController>(
      TranslationController,
    );
    translationService = app.get<TranslationService>(TranslationService);

    req = createRequest({
      user: {
        companyId: '',
      },
      query: {},
    });
  });

  beforeEach(() => {
    res = {
      header: {},
      data: '',
      setData(data) {
        this.data = data;
      },
      getData() {
        return this.data;
      },
      setHeader(name: string, value: string) {
        this.header[name] = value;
      },
      getHeader(name) {
        return this.header[name];
      },
      write(data: string, func: Function) {
        this.setData(data);
        func(undefined);
      },
      end() {
        return;
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTranslationsAction', () => {
    it('should return a translation string', async () => {
      const expectedResult = {
        translationKey: 'translation value',
      };
      const getTranslationsSpy = jest
        .spyOn(translationService, 'getTranslations')
        .mockImplementation(async () => {
          return JSON.stringify(expectedResult);
        });

      expect(
        await translationController.getTranslationsAction(
          req,
          new TranslationDto(),
        ),
      ).toEqual(JSON.stringify(expectedResult));
      expect(getTranslationsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTranslationsJsonFile', () => {
    it('should throw internal server error exception', async () => {
      const expectedResult = {
        translationKey: 'translation value',
      };

      const getTranslationsSpy = jest
        .spyOn(translationService, 'getTranslations')
        .mockImplementation(async () => {
          return JSON.stringify(expectedResult);
        });

      res.write = (data: any, func: Function) => {
        func({});
      };

      await expect(
        translationController.getTranslationsJsonFile(
          req,
          new TranslationDto(),
          res,
        ),
      ).rejects.toThrow(InternalServerErrorException);
      expect(getTranslationsSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a json translation file', async () => {
      const expectedResult = {
        translationKey: 'translation value',
      };
      const getTranslationsSpy = jest
        .spyOn(translationService, 'getTranslations')
        .mockImplementation(async () => {
          return JSON.stringify(expectedResult);
        });

      expect(
        await translationController.getTranslationsJsonFile(
          req,
          new TranslationDto(),
          res,
        ),
      ).toBe(undefined);
      expect(getTranslationsSpy).toHaveBeenCalledTimes(1);
      expect(res.getHeader('Content-disposition')).toBe(
        'attachment; filename=translation.json',
      );
      expect(res.getHeader('Content-type')).toBe('application/json');
      expect(res.getData()).toBe(JSON.stringify(expectedResult));
    });
  });

  describe('getTranslationsYamlFile', () => {
    it('should throw internal server error exception', async () => {
      const expectedResult = {
        translationKey: 'translation value',
      };

      const getTranslationsSpy = jest
        .spyOn(translationService, 'getTranslations')
        .mockImplementation(async () => {
          return JSON.stringify(expectedResult);
        });

      res.write = (data: any, func: Function) => {
        func({});
      };

      await expect(
        translationController.getTranslationsYamlFile(
          req,
          new TranslationDto(),
          res,
        ),
      ).rejects.toThrow(InternalServerErrorException);
      expect(getTranslationsSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a yml translation file', async () => {
      const expectedResult = {
        translationKey: 'translation value',
      };
      const getTranslationsSpy = jest
        .spyOn(translationService, 'getTranslations')
        .mockImplementation(async () => {
          return JSON.stringify(expectedResult);
        });

      expect(
        await translationController.getTranslationsYamlFile(
          req,
          new TranslationDto(),
          res,
        ),
      ).toBe(undefined);
      expect(getTranslationsSpy).toHaveBeenCalledTimes(1);
      expect(res.getHeader('Content-disposition')).toBe(
        'attachment; filename=translation.yaml',
      );
      expect(res.getHeader('Content-type')).toBe('text/yaml');
      expect(res.getData()).toBe(JSON.stringify(expectedResult));
    });
  });
});
