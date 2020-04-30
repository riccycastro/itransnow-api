import { Test, TestingModule } from '@nestjs/testing';
import { TranslationKeyController } from '../../../src/Controllers/translation-key.controller';
import { TranslationKeyService } from '../../../src/Services/translation-key.service';
import { ApplicationService } from '../../../src/Services/application.service';
import { buildApplicationWithId1 } from '../../helper/builder/application.builder';
import { buildTranslationKeyArray, buildTranslationKeyWithId1 } from '../../helper/builder/translation-key.build';
import { createRequest } from 'node-mocks-http';
import { buildTranslationWithId1 } from '../../helper/builder/translation.builder';
import { TranslationStatusDto } from '../../../src/Dto/translation.dto';

describe('TranslationKeyController', () => {
  let app: TestingModule;
  let translationKeyController: TranslationKeyController;
  let translationKeyService: TranslationKeyService;
  let applicationService: ApplicationService;
  let req: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TranslationKeyController],
      providers: [
        TranslationKeyService,
        ApplicationService,
        {
          provide: 'TranslationKeyRepository',
          useValue: {},
        },
        {
          provide: 'TranslationService',
          useValue: {},
        },
        {
          provide: 'MomentProvider',
          useValue: {},
        },
        {
          provide: 'TranslationStatusService',
          useValue: {},
        },
        {
          provide: 'ApplicationRepository',
          useValue: {},
        },
        {
          provide: 'LanguageService',
          useValue: {},
        },
        {
          provide: 'SectionService',
          useValue: {},
        },
        {
          provide: 'WhiteLabelService',
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

    translationKeyController = app.get<TranslationKeyController>(TranslationKeyController);
    translationKeyService = app.get<TranslationKeyService>(TranslationKeyService);
    applicationService = app.get<ApplicationService>(ApplicationService);

    req = createRequest({
      user: {
        companyId: '',
      },
      query: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTranslationKeyAction', () => {
    it('should return a translation key', async () => {
      const getTranslationKeySpy = jest.spyOn(applicationService, 'getTranslationKey').mockImplementation(async () => {
        return buildTranslationKeyWithId1();
      });

      const getByAliasOrFailSpy = jest.spyOn(applicationService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      expect(await translationKeyController.getTranslationKeyAction(req, 'applicationAlias', 'translationKeyAlias'))
        .toEqual(buildTranslationKeyWithId1());
      expect(getTranslationKeySpy).toHaveBeenCalledTimes(1);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTranslationKeysAction', () => {
    it('should return an array of translation keys', async () => {
      const getByAliasOrFailSpy = jest.spyOn(applicationService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      const getTranslationKeysSpy = jest.spyOn(applicationService, 'getTranslationKeys').mockImplementation(async () => {
        return {
          data: buildTranslationKeyArray(),
          count: 5,
        };
      });

      expect(await translationKeyController.getTranslationKeysAction(req, 'applicationAlias'))
        .toEqual({
          data: buildTranslationKeyArray(),
          count: 5,
        });
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(getTranslationKeysSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTranslationKey', () => {
    it('should call all necessary methods to delete', async () => {
      const getByAliasOrFailSpy = jest.spyOn(applicationService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      const deleteTranslationKeySpy = jest.spyOn(applicationService, 'deleteTranslationKey').mockImplementation(async () => {
        return buildTranslationKeyWithId1();
      });

      expect(await translationKeyController.deleteTranslationKey(req, 'applicationAlias', 'translationKeyAlias'))
        .toBeUndefined();
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(deleteTranslationKeySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('statusTranslation', () => {
    it('should return the updated translation', async () => {
      const statusTranslationSpy = jest.spyOn(translationKeyService, 'statusTranslation').mockImplementation(async () => {
        return buildTranslationWithId1();
      });

      const getByAliasOrFailSpy = jest.spyOn(applicationService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      const getTranslationKeySpy = jest.spyOn(applicationService, 'getTranslationKey').mockImplementation(async () => {
        return buildTranslationKeyWithId1();
      });


      expect(await translationKeyController.statusTranslation(
        new TranslationStatusDto(),
        req,
        'applicationAlias',
        'translationKeyAlias',
        'translationAlias',
        ),
      ).toEqual(buildTranslationWithId1());
      expect(getTranslationKeySpy).toHaveBeenCalledTimes(1);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(statusTranslationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTranslation', () => {
    it('should call all necessary methods to delete a translation', async () => {
      const getByAliasOrFailSpy = jest.spyOn(applicationService, 'getByAliasOrFail').mockImplementation(async () => {
        return buildApplicationWithId1();
      });

      const getTranslationKeySpy = jest.spyOn(applicationService, 'getTranslationKey').mockImplementation(async () => {
        return buildTranslationKeyWithId1();
      });

      const deleteTranslationSpy = jest.spyOn(translationKeyService, 'deleteTranslation').mockImplementation(async () => {
        return buildTranslationWithId1();
      });

      expect(await translationKeyController.deleteTranslation(
        req,
        'applicationAlias',
        'translationKeyAlias',
        'translationAlias',
      )).toBeUndefined();
      expect(deleteTranslationSpy).toHaveBeenCalledTimes(1);
      expect(getTranslationKeySpy).toHaveBeenCalledTimes(1);
      expect(getByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });
});
