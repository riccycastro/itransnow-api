import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AbstractEntityService } from './AbstractEntityService';
import { Translation } from '../Entities/translation.entity';
import { TranslationRepository } from '../Repositories/translation.repository';
import { TranslationDto, TranslationNodeDto } from '../Dto/translation.dto';
import { User } from '../Entities/user.entity';
import { LanguageService } from './language.service';
import { TranslationKeyService } from './translation-key.service';
import { TranslationStatusService } from './translation-status.service';
import { Application } from '../Entities/application.entity';
import { Language } from '../Entities/language.entity';
import { TranslationKey } from '../Entities/translation-key.entity';
import { TranslationStatus } from '../Entities/translation-status.entity';
import { ConvertToYamlNode } from './TranslationChainResponsability/Node/convert-to-yaml.node';
import { NestedIndexNode } from './TranslationChainResponsability/Node/nested-index.node';
import { FlatIndexNode } from './TranslationChainResponsability/Node/flat-index.node';
import { ApplicationService } from './application.service';
import { WhiteLabelService } from './white-label.service';
import * as deepmerge from 'deepmerge';
import { QueryRunnerProvider } from './Provider/query-runner.provider';
import { StringProvider } from './Provider/string.provider';
import { MomentProvider } from './Provider/moment.provider';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';

@Injectable()
export class TranslationService extends AbstractEntityService<Translation> {
  private indexValidOptions = ['flat', 'nested'];
  private fileValidExtensions = ['yaml'];

  private readonly languageService: LanguageService;
  private readonly translationStatusService: TranslationStatusService;

  constructor(
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService,
    @Inject(forwardRef(() => WhiteLabelService))
    private readonly whiteLabelService: WhiteLabelService,
    translationRepository: TranslationRepository,
    @Inject(forwardRef(() => TranslationKeyService))
    private readonly translationKeyService: TranslationKeyService,
    languageService: LanguageService,
    translationStatusService: TranslationStatusService,
    private readonly queryRunnerProvider: QueryRunnerProvider,
    private readonly stringProvider: StringProvider,
    private readonly momentProvider: MomentProvider,
  ) {
    super(translationRepository);
    this.languageService = languageService;
    this.translationStatusService = translationStatusService;
  }

  async getByAliasOrFail(
    translationKeyId: number,
    alias: string,
    query?: QueryPaginationInterface,
  ): Promise<Translation> {
    const translation =
      query && query.whiteLabel
        ? await this.getByAliasInWhiteLabel(
            translationKeyId,
            query.whiteLabel as string,
            alias,
          )
        : await this.getByAlias(translationKeyId, alias);

    if (!translation) {
      throw new NotFoundException(`Translation ${alias} not found`);
    }

    return await this.getIncludes(translationKeyId, translation, query);
  }

  create(
    language: Language,
    user: User,
    translationStatus: TranslationStatus,
    translation: string,
    translationKey?: TranslationKey,
  ): Translation {
    const translationEntity = new Translation();
    translationEntity.alias = this.stringProvider.generateRandomStringWithLength10();
    translationEntity.language = language;
    translationEntity.createdBy = user;
    translationEntity.translation = translation;
    translationEntity.translationKey = translationKey;
    translationEntity.translationStatus = translationStatus;

    //todo@rcastro - add translation team

    return translationEntity;
  }

  delete(translation: Translation): Translation {
    translation.deletedAt = this.momentProvider.utc().unix();
    return translation;
  }

  async persist(
    user: User,
    application: Application,
    translationDto: TranslationDto,
  ): Promise<Translation> {
    const translationStatus = await this.translationStatusService.getByStatus(
      TranslationStatusService.APPROVAL_PENDING,
    );
    const language = await this.languageService.getByCodeInApplication(
      application.id,
      translationDto.language,
    );

    const translationKey = await this.translationKeyService.get(
      user.companyId,
      application.id,
      translationDto.translationKey,
    );
    translationKey.application = application;

    let translation = this.create(
      language,
      user,
      translationStatus,
      translationDto.translation,
      translationKey,
    );

    const queryRunner = this.queryRunnerProvider.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      translation.translationKey = await this.translationKeyService.save(
        translation.translationKey,
        queryRunner.manager,
      );
      translation = await this.save(translation, queryRunner.manager);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return translation;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new InternalServerErrorException();
    }
  }

  async getTranslationInApplicationByLanguage(
    applicationId: number,
    languageId: number,
    translationKeys: string[],
    sections: string[],
  ): Promise<Translation[]> {
    return await (this
      .repository as TranslationRepository).findTranslationInApplicationByLanguage(
      applicationId,
      languageId,
      translationKeys,
      sections,
    );
  }

  async getTranslationInWhiteLabelByLanguage(
    whiteLabelId: number,
    languageId: number,
    translationKeys: string[],
    sections: string[],
  ): Promise<Translation[]> {
    return await (this
      .repository as TranslationRepository).findTranslationInWhiteLabelTranslationByLanguage(
      whiteLabelId,
      languageId,
      translationKeys,
      sections,
    );
  }

  async getTranslations(companyId: number, translationDto: TranslationDto) {
    const translationNodeDto = await this.getTranslationNodeDto(
      companyId,
      translationDto,
    );
    const translations = await this.getTranslationInApplicationByLanguage(
      translationNodeDto.application.id,
      translationNodeDto.language.id,
      translationNodeDto.translationKeys,
      translationNodeDto.sections,
    );
    let translationsIndexed = this.indexTranslationBy(
      translationDto.indexType,
      translations,
    );

    if (translationNodeDto.whiteLabel) {
      const whiteLabelTranslationsIndexed = await this.getWhiteLabelTranslations(
        translationDto,
        translationNodeDto,
      );
      translationsIndexed = deepmerge(
        translationsIndexed,
        whiteLabelTranslationsIndexed[translationNodeDto.whiteLabel.alias],
      );
    }

    if (translationDto.includes.length) {
      const getWhiteLabelTask = [];
      for (const include of translationDto.includes) {
        getWhiteLabelTask.push(
          this.getWhiteLabelsIncludes(
            include,
            translationDto,
            translationNodeDto,
          ),
        );
      }

      const whiteLabelsIncludes = await Promise.all(getWhiteLabelTask);

      translationsIndexed = Object.assign(
        translationsIndexed,
        ...whiteLabelsIncludes,
      );
    }

    return this.addToFile(translationDto.extension, translationsIndexed);
  }

  async getTranslationsWithLanguageAndStatusByTranslationKey(
    translationKeyId: number,
    whiteLabelAlias?: string,
  ): Promise<Translation[]> {
    return await (this
      .repository as TranslationRepository).findTranslationsWithLanguageAndStatus(
      translationKeyId,
      whiteLabelAlias,
    );
  }

  private async getByAlias(
    translationKeyId: number,
    alias: string,
  ): Promise<Translation | undefined> {
    return await this.repository.findOne({
      alias,
      deletedAt: 0,
      translationKey: translationKeyId as any,
    });
  }

  private async getByAliasInWhiteLabel(
    translationKeyId: number,
    whiteLabelAlias: string,
    alias: string,
  ): Promise<Translation | undefined> {
    return await (this
      .repository as TranslationRepository).findTranslationWithLanguageAndStatus(
      translationKeyId,
      whiteLabelAlias,
      alias,
    );
  }

  private async getWhiteLabelsIncludes(
    alias: string,
    translationDto: TranslationDto,
    translationNodeDto: TranslationNodeDto,
  ) {
    const whiteLabel = await this.whiteLabelService.findByAliasOrFail(
      translationNodeDto.application.id,
      alias,
    );

    const translationNodeDtoClone = new TranslationNodeDto();
    translationNodeDtoClone.whiteLabel = whiteLabel;
    translationNodeDtoClone.language = translationNodeDto.language;
    translationNodeDtoClone.translationKeys =
      translationNodeDto.translationKeys;
    translationNodeDtoClone.sections = translationNodeDto.sections;

    return await this.getWhiteLabelTranslations(
      translationDto,
      translationNodeDtoClone,
    );
  }

  private async getWhiteLabelTranslations(
    translationDto: TranslationDto,
    translationNodeDto: TranslationNodeDto,
  ) {
    const translations = TranslationService.moveWhiteLabelSectionsToTranslation(
      await this.getTranslationInWhiteLabelByLanguage(
        translationNodeDto.whiteLabel.id,
        translationNodeDto.language.id,
        translationNodeDto.translationKeys,
        translationNodeDto.sections,
      ),
    );

    return {
      [translationNodeDto.whiteLabel.alias]: this.indexTranslationBy(
        translationDto.indexType,
        translations,
      ),
    };
  }

  private addToFile(extension: string, translations: string[]): string {
    if (this.fileValidExtensions.includes(extension)) {
      return new ConvertToYamlNode().apply(translations);
    }
    return JSON.stringify(translations);
  }

  private indexTranslationBy(indexType: string, translations: Translation[]) {
    if (this.indexValidOptions.includes(indexType) && indexType === 'nested') {
      return new NestedIndexNode().apply(translations);
    }

    return new FlatIndexNode().apply(translations);
  }

  private async getTranslationNodeDto(
    companyId: number,
    translationDto: TranslationDto,
  ): Promise<TranslationNodeDto> {
    const translationNodeDto = new TranslationNodeDto();
    translationNodeDto.application = await this.applicationService.getByAliasOrFail(
      companyId,
      translationDto.application,
    );
    translationNodeDto.language = await this.languageService.getByCodeInApplication(
      translationNodeDto.application.id,
      translationDto.language,
    );
    translationNodeDto.translationKeys = translationDto.translationKey
      ? translationDto.translationKey.split(',')
      : undefined;
    translationNodeDto.sections = translationDto.section
      ? translationDto.section.split(',')
      : undefined;
    translationNodeDto.whiteLabel = translationDto.whiteLabel
      ? await this.whiteLabelService.findByAliasOrFail(
          companyId,
          translationDto.whiteLabel,
        )
      : undefined;
    return translationNodeDto;
  }

  protected async getIncludes(
    translationKeyId: number,
    translation: Translation,
    query: QueryPaginationInterface,
  ): Promise<Translation> {
    if (!query || !query.includes) {
      return translation;
    }

    // todo@rcastro - create const for the includes... all of them
    if (query.includes.includes('translationStatus')) {
      translation.translationStatus = await this.translationStatusService.getTranslationStatusByTranslation(
        translation.id,
      );
    }

    return translation;
  }

  static moveWhiteLabelSectionsToTranslation(
    translations: Translation[],
  ): Translation[] {
    for (const translation of translations) {
      if (
        translation.whiteLabelTranslations &&
        translation.whiteLabelTranslations.length > 0
      ) {
        for (const whiteLabelTranslation of translation.whiteLabelTranslations) {
          translation.translationKey = whiteLabelTranslation.translationKey;
          if (
            whiteLabelTranslation.translationKey &&
            whiteLabelTranslation.translationKey.sections
          ) {
            for (const section of whiteLabelTranslation.translationKey
              .sections) {
              if (translation.translationKey.sections) {
                translation.translationKey.sections = [];
              }
              translation.translationKey.sections.push(section);
            }
          }
        }
      }
    }

    return translations;
  }
}
