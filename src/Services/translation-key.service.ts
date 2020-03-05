import { Injectable, NotFoundException } from '@nestjs/common';
import { AbstractEntityService } from './AbstractEntityService';
import { TranslationKey } from '../Entities/translation-key.entity';
import { TranslationKeyRepository } from '../Repositories/translation-key.repository';

@Injectable()
export class TranslationKeyService extends AbstractEntityService<TranslationKey> {

    constructor(translationKeyRepository: TranslationKeyRepository) {
        super(translationKeyRepository);
    }

    async getByTranslationKeyInApplication(companyId: number, applicationId: number, translationKey: string): Promise<TranslationKey>{
        const translationKeyEntity = await (this.repository as TranslationKeyRepository).findByTranslationKeyInApplication(companyId, applicationId, translationKey);

        if(!translationKeyEntity){
            throw new NotFoundException("Translation key not found!");
        }

        return translationKeyEntity;
    }

    async getByTranslationKeys(companyId: number, translationKeys: string[]): Promise<TranslationKey[]> {
        return await (this.repository as TranslationKeyRepository).findByTranslationKeysInApplication(companyId, translationKeys);
    }

    async get(companyId: number, applicationId: number, translationKey: string): Promise<TranslationKey> {
        let translationKeyEntity = await (this.repository as TranslationKeyRepository).findByTranslationKeyInApplication(companyId, applicationId, translationKey);

        if(!translationKeyEntity){
            translationKeyEntity = new TranslationKey();
            translationKeyEntity.alias = translationKey;
        }

        return translationKeyEntity;
    }

}
