import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TranslationKey } from '../Entities/translation-key.entity';
import { TranslationKeyRepository } from '../Repositories/translation-key.repository';
import { AbstractEntityListingService } from './AbstractEntityListingService';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';
import { TranslationService } from './translation.service';
import { MomentProvider } from './Provider/moment.provider';
import { Translation } from '../Entities/translation.entity';
import { TranslationStatusService } from './translation-status.service';
import { TranslationStatusDto } from '../Dto/translation.dto';

export enum TranslationKeyIncludesEnum {
  translations = 'translations',
}

@Injectable()
export class TranslationKeyService extends AbstractEntityListingService<
  TranslationKey
> {
  constructor(
    translationKeyRepository: TranslationKeyRepository,
    @Inject(forwardRef(() => TranslationService))
    private readonly translationService: TranslationService,
    private readonly momentProvider: MomentProvider,
    private readonly translationStatusService: TranslationStatusService,
  ) {
    super(translationKeyRepository);
  }

  async getByTranslationKeyInApplication(
    companyId: number,
    applicationId: number,
    translationKey: string,
  ): Promise<TranslationKey> {
    const translationKeyEntity = await (this
      .repository as TranslationKeyRepository).findByTranslationKeyInApplication(
      companyId,
      applicationId,
      translationKey,
    );

    if (!translationKeyEntity) {
      throw new NotFoundException('Translation key not found!');
    }

    return translationKeyEntity;
  }

  async getByTranslationKeys(
    companyId: number,
    translationKeys: string[],
  ): Promise<TranslationKey[]> {
    return await (this
      .repository as TranslationKeyRepository).findByTranslationKeysInApplication(
      companyId,
      translationKeys,
    );
  }

  async get(
    companyId: number,
    applicationId: number,
    translationKey: string,
  ): Promise<TranslationKey> {
    let translationKeyEntity = await (this
      .repository as TranslationKeyRepository).findByTranslationKeyInApplication(
      companyId,
      applicationId,
      translationKey,
    );

    if (!translationKeyEntity) {
      translationKeyEntity = new TranslationKey();
      translationKeyEntity.alias = translationKey;
    }

    return translationKeyEntity;
  }

  async getByAliasOrFail(
    applicationId: number,
    alias: string,
    query?: any,
  ): Promise<TranslationKey> {
    const translationKey = await this.getByAlias(applicationId, alias);

    if (!translationKey) {
      throw new NotFoundException(`translation Key ${alias} not found!`);
    }

    return await this.getIncludes(applicationId, translationKey, query);
  }

  protected async getEntityListAndCount(
    applicationId: number,
    query?: QueryPaginationInterface,
  ): Promise<[TranslationKey[], number]> {
    const listResult = await (this
      .repository as TranslationKeyRepository).findInList(applicationId, query);

    for await (let translationKey of listResult[0]) {
      translationKey = await this.getIncludes(
        applicationId,
        translationKey,
        query,
      );
    }

    return listResult;
  }

  private async getByAlias(
    applicationId: number,
    alias: string,
  ): Promise<TranslationKey> {
    return await (this.repository as TranslationKeyRepository).findByAlias(
      applicationId,
      alias,
    );
  }

  delete(translationKey: TranslationKey): TranslationKey {
    translationKey.deletedAt = this.momentProvider.utc().unix();
    return translationKey;
  }

  async deleteTranslation(
    translationKey: TranslationKey,
    translationAlias: string,
    query?: QueryPaginationInterface,
  ): Promise<Translation> {
    return await this.translationService.save(
      await this.translationService.delete(
        await this.translationService.getByAliasOrFail(
          translationKey.id,
          translationAlias,
          query,
        ),
      ),
    );
  }

  async statusTranslation(
    translationKey: TranslationKey,
    translationAlias: string,
    translationStatusDto: TranslationStatusDto,
    query?: QueryPaginationInterface,
  ): Promise<Translation> {
    const translationStatus = await this.translationStatusService.getByStatus(
      translationStatusDto.status,
    );

    if (query) {
      query.includes = 'applicationStatus';
    }

    const translation = await this.translationService.getByAliasOrFail(
      translationKey.id,
      translationAlias,
      query || { includes: 'applicationStatus' },
    );
    const allowedStatus = TranslationStatusService.statusTranslationStateMachine(
      translation.translationStatus.status,
    );

    if (!allowedStatus.includes(translationStatusDto.status)) {
      throw new BadRequestException(
        `You cannot go to status '${translationStatusDto.status}' from ${translation.translationStatus.status}`,
      );
    }

    translation.translationStatus = translationStatus;

    await this.translationService.save(translation);

    return translation;
  }

  protected async getIncludes(
    applicationId: number,
    translationKey: TranslationKey,
    query: QueryPaginationInterface,
  ): Promise<TranslationKey> {
    if (!query || !query.includes) {
      return translationKey;
    }

    if (query.includes.includes('translations')) {
      translationKey.translations = await this.translationService.getTranslationsWithLanguageAndStatusByTranslationKey(
        translationKey.id,
        query.whiteLabel,
      );
    }

    return translationKey;
  }
}
