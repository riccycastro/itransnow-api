import { Test, TestingModule } from '@nestjs/testing';
import { SectionService } from '../../../src/Services/section.service';
import { SectionRepository } from '../../../src/Repositories/section.repository';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { buildSectionArray, buildSectionWithId1 } from '../../helper/builder/section.builder';
import { classToClass } from 'class-transformer';
import { Section } from '../../../src/Entities/section.entity';
import { Application } from '../../../src/Entities/application.entity';
import { SectionDto } from '../../../src/Dto/section.dto';
import { buildApplicationWithId1 } from '../../helper/builder/application.builder';
import { utc as MomentUtc } from 'moment';
import { MomentProvider } from '../../../src/Services/Provider/moment.provider';
import { TranslationKeyService } from '../../../src/Services/translation-key.service';
import { buildTranslationKey, buildTranslationKeyArray } from '../../helper/builder/translation-key.build';
import { QueryRunner } from '../../../src/Types/type';
import { QueryRunnerProvider } from '../../../src/Services/Provider/query-runner.provider';
import { TranslationKeyToSectionDto } from '../../../src/Dto/translation-key.dto';

describe('SectionService', () => {
  let app: TestingModule;
  let sectionService: SectionService;
  let sectionRepository: SectionRepository;
  let translationKeyService: TranslationKeyService;
  let queryRunnerProvider: QueryRunnerProvider;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        SectionService,
        SectionRepository,
        MomentProvider,
        TranslationKeyService,
        QueryRunnerProvider,
        {
          provide: 'ApplicationService',
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
      ],
    }).compile();

    sectionService = app.get<SectionService>(SectionService);
    sectionRepository = app.get<SectionRepository>(SectionRepository);
    translationKeyService = app.get<TranslationKeyService>(TranslationKeyService);
    queryRunnerProvider = app.get<QueryRunnerProvider>(QueryRunnerProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByAliasOrFail', () => {
    it('should throw a not found exception', async () => {
      const findByAliasSpy = jest.spyOn(sectionRepository, 'findByAlias').mockImplementation(async () => {
        return undefined;
      });

      await expect(sectionService.findByAliasOrFail(1, '')).rejects.toThrow(NotFoundException);
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a section', async () => {
      const findByAliasSpy = jest.spyOn(sectionRepository, 'findByAlias').mockImplementation(async () => {
        return buildSectionWithId1();
      });

      expect(await sectionService.findByAliasOrFail(1, '')).toEqual(buildSectionWithId1());
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByApplication', () => {
    it('should return undefined', async () => {
      const findByAliasSpy = jest.spyOn(sectionRepository, 'findByApplication').mockImplementation(async () => {
        return undefined;
      });

      expect(await sectionService.getByApplication(1, 1, {})).toBeUndefined();
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an array of section', async () => {
      const findByAliasSpy = jest.spyOn(sectionRepository, 'findByApplication').mockImplementation(async () => {
        return buildSectionArray();
      });

      expect(await sectionService.getByApplication(1, 1, {})).toEqual(buildSectionArray());
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findInList', () => {
    it('should return find in list expected structure', async () => {
      const findByAliasSpy = jest.spyOn(sectionRepository, 'findInList').mockImplementation(async () => {
        return [buildSectionArray(), 5];
      });

      expect(await sectionService.findInList(1, {})).toEqual({
        data: classToClass(buildSectionArray()),
        count: 5,
      });
      expect(findByAliasSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should throw a bad request exception', async () => {
      const findOneSpy = jest.spyOn(sectionRepository, 'findOne').mockImplementation(async () => {
        return new Section();
      });

      await expect(sectionService.create(buildSectionWithId1(), new Application())).rejects.toThrow(BadRequestException);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a new section', async () => {
      const findOneSpy = jest.spyOn(sectionRepository, 'findOne').mockImplementation(async () => {
        return undefined;
      });

      const sectionDto = new SectionDto();
      sectionDto.name = ' New Section ';
      sectionDto.alias = 'new_section';

      const expectedSection = new Section();
      expectedSection.application = buildApplicationWithId1();
      expectedSection.name = sectionDto.name;
      expectedSection.alias = sectionDto.alias;

      expect(await sectionService.create(sectionDto, buildApplicationWithId1())).toEqual(expectedSection);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return a section', () => {
      const expectedSection = buildSectionWithId1();
      expectedSection.deletedAt = MomentUtc().unix();

      expect(sectionService.delete(buildSectionWithId1())).toEqual(expectedSection);
    });
  });

  describe('active', () => {
    it('should return an inactive section', () => {
      const expectedSection = buildSectionWithId1();
      expectedSection.isActive = false;

      expect(sectionService.active(buildSectionWithId1(), { isActive: false })).toEqual(expectedSection);
    });

    it('should return an active section', () => {
      const expectedSection = buildSectionWithId1();
      expectedSection.isActive = true;

      expect(sectionService.active(buildSectionWithId1(), { isActive: true })).toEqual(expectedSection);
    });
  });

  describe('update', () => {
    it('should return he updated section', () => {
      const expectedResult = buildSectionWithId1();
      expectedResult.name = 'The nice Section';
      expectedResult.alias = 'the_nice_section';

      expect(sectionService.update(buildSectionWithId1(), { name: 'The nice Section', alias: 'The nice Section' }))
        .toEqual(expectedResult);
    });
  });

  describe('addTranslationKeys', () => {
    it('should throw a conflict exception', async () => {
      const getByTranslationKeysSpy = jest.spyOn(translationKeyService, 'getByTranslationKeys').mockImplementation(async () => {
          return buildTranslationKeyArray();
        },
      );

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

      const assignTranslationKeySpy = jest.spyOn(sectionRepository, 'assignTranslationKey').mockImplementation(async () => {
        throw {
          code: 'ER_DUP_ENTRY',
          parameters: [
            1, 1,
          ],
        };
      });

      await expect(sectionService.addTranslationKeys(1, new Section(), new TranslationKeyToSectionDto())).rejects.toThrow(ConflictException);
      expect(getByTranslationKeysSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(assignTranslationKeySpy).toHaveBeenCalledTimes(5);
    });

    it('should throw an internal server error exception', async () => {
      const getByTranslationKeysSpy = jest.spyOn(translationKeyService, 'getByTranslationKeys').mockImplementation(async () => {
          return buildTranslationKeyArray();
        },
      );

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

      const assignTranslationKeySpy = jest.spyOn(sectionRepository, 'assignTranslationKey').mockImplementation(async () => {
        throw new Error();
      });

      await expect(sectionService.addTranslationKeys(1, new Section(), new TranslationKeyToSectionDto())).rejects.toThrow(InternalServerErrorException);
      expect(getByTranslationKeysSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(assignTranslationKeySpy).toHaveBeenCalledTimes(5);
    });

    it('should return the section', async () => {
      const getByTranslationKeysSpy = jest.spyOn(translationKeyService, 'getByTranslationKeys').mockImplementation(async () => {
          return [buildTranslationKey(1)];
        },
      );

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

      const assignTranslationKeySpy = jest.spyOn(sectionRepository, 'assignTranslationKey').mockImplementation(async () => {
        return;
      });

      const expectedResult = buildSectionWithId1();

      expect(await sectionService.addTranslationKeys(1, buildSectionWithId1(), new TranslationKeyToSectionDto())).toEqual(expectedResult);
      expect(getByTranslationKeysSpy).toHaveBeenCalledTimes(1);
      expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
      expect(assignTranslationKeySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeTranslationKeys', () => {
    it('should return a section', async () => {
      const getByTranslationKeysSpy = jest.spyOn(translationKeyService, 'getByTranslationKeys').mockImplementation(async () => {
          return [buildTranslationKey(1)];
        },
      );

      const removeTranslationKeySpy = jest.spyOn(sectionRepository, 'removeTranslationKey').mockImplementation(async () => {
        return;
      });

      expect(await sectionService.removeTranslationKeys(1, new Section(), new TranslationKeyToSectionDto())).toEqual(new Section());
      expect(getByTranslationKeysSpy).toHaveBeenCalledTimes(1);
      expect(removeTranslationKeySpy).toHaveBeenCalledTimes(1);
    });
  });
});
