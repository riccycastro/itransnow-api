import { Test, TestingModule } from '@nestjs/testing';
import { SectionController } from '../../../src/Controllers/section.controller';
import { SectionService } from '../../../src/Services/section.service';
import { NotFoundException } from '@nestjs/common';
import { buildSection, buildSectionWithId1 } from '../../helper/builder/section.builder';
import { ActiveSectionDto, SectionDto } from '../../../src/Dto/section.dto';
import { TranslationKeyToSectionDto } from '../../../src/Dto/translation-key.dto';

describe('SectionController', () => {
  let app: TestingModule;
  let sectionController: SectionController;
  let sectionService: SectionService;
  let req: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [SectionController],
      providers: [
        SectionService,
        {
          provide: 'SectionRepository',
          useValue: {},
        },
        {
          provide: 'ApplicationService',
          useValue: {},
        },
        {
          provide: 'TranslationKeyService',
          useValue: {},
        },
        {
          provide: 'Connection',
          useValue: {},
        },
      ],
    }).compile();

    sectionController = app.get<SectionController>(SectionController);
    sectionService = app.get<SectionService>(SectionService);

    req = {
      user: {
        companyId: '',
      },
      query: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSectionAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(sectionController.getSectionAction(req, 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a section', async () => {
      const section = buildSectionWithId1();
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        return section;
      });

      expect(await sectionController.getSectionAction(req, 'alias')).toEqual(section);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSectionsAction', () => {
    it('should return a list of section with count', async () => {
      const expectedResponse = {
        data: [1, 2, 3, 4, 5].map(index => {
          return buildSection(index);
        }),
        count: 5,
      };

      const findInListSpy = jest.spyOn(sectionService, 'findInList').mockImplementation(async () => {
        return expectedResponse;
      });

      expect(await sectionController.getSectionsAction(req)).toEqual(expectedResponse);
      expect(findInListSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an empty list of section with count equal 0', async () => {
      const expectedResponse = { data: [], count: 0 };

      const findInListSpy = jest.spyOn(sectionService, 'findInList').mockImplementation(async () => {
        return expectedResponse;
      });

      expect(await sectionController.getSectionsAction(req)).toEqual(expectedResponse);
      expect(findInListSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteSectionAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(sectionController.deleteSectionAction(req, 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should call all necessary methods to delete section', async () => {
      const section = buildSectionWithId1();
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        return section;
      });

      const deleteSpy = jest.spyOn(sectionService, 'delete').mockImplementation(() => {
        return section;
      });

      const saveSpy = jest.spyOn(sectionService, 'save').mockImplementation(async () => {
        return section;
      });

      expect(await sectionController.deleteSectionAction(req, 'alias')).toBe(undefined);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateSectionAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(sectionController.updateSectionAction(req, new SectionDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a section', async () => {
      const expectedResult = buildSectionWithId1();
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const updateSpy = jest.spyOn(sectionService, 'update').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await sectionController.updateSectionAction(req, new SectionDto(), 'alias')).toEqual(expectedResult);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('activeSectionAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(sectionController.activeSectionAction(req, new ActiveSectionDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a section', async () => {
      const expectedResult = buildSectionWithId1();
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const activeSpy = jest.spyOn(sectionService, 'active').mockImplementation(() => {
        return expectedResult;
      });

      const saveSpy = jest.spyOn(sectionService, 'save').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await sectionController.activeSectionAction(req, new ActiveSectionDto(), 'alias')).toEqual(expectedResult);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(activeSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addTranslationKeyToSectionAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(sectionController.addTranslationKeyToSectionAction(req, new TranslationKeyToSectionDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should call all necessary methods to add translation key to section', async () => {
      const expectedResult = buildSectionWithId1();
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const addTranslationKeysSpy = jest.spyOn(sectionService, 'addTranslationKeys').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await sectionController.addTranslationKeyToSectionAction(req, new TranslationKeyToSectionDto(), 'alias')).toBe(undefined);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(addTranslationKeysSpy).toHaveBeenCalledTimes(1);
    })
  });

  describe('removeTranslationKeyToSectionAction', () => {
    it('should throw not found exception', async () => {
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(sectionController.removeTranslationKeyToSectionAction(req, new TranslationKeyToSectionDto(), 'alias')).rejects.toThrow();
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
    });

    it('should call all necessary methods to remove translation key to section', async () => {
      const expectedResult = buildSectionWithId1();
      const findByAliasOrFailSpy = jest.spyOn(sectionService, 'findByAliasOrFail').mockImplementation(async () => {
        return expectedResult;
      });

      const removeTranslationKeysSpy = jest.spyOn(sectionService, 'removeTranslationKeys').mockImplementation(async () => {
        return expectedResult;
      });

      expect(await sectionController.removeTranslationKeyToSectionAction(req, new TranslationKeyToSectionDto(), 'alias')).toBe(undefined);
      expect(findByAliasOrFailSpy).toHaveBeenCalledTimes(1);
      expect(removeTranslationKeysSpy).toHaveBeenCalledTimes(1);
    })
  });
});
