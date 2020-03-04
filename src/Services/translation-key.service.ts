import { Injectable, NotFoundException } from '@nestjs/common';
import {AbstractEntityService} from "./AbstractEntityService";
import {TranslationKey} from "../Entities/translation-key.entity";
import {TranslationKeyRepository} from "../Repositories/translation-key.repository";

@Injectable()
export class TranslationKeyService extends AbstractEntityService<TranslationKey> {

    constructor(translationKeyRepository: TranslationKeyRepository) {
        super(translationKeyRepository);
    }

    async getByTranslationKey(companyId: number, applicationId: number, translationKey: string): Promise<TranslationKey>{
        const translationKeyEntity = await (this.repository as TranslationKeyRepository).findByTranslationKey(companyId, applicationId, translationKey);

        if(!translationKeyEntity){
            throw new NotFoundException("Translation key not found!");
        }

        return translationKeyEntity;
    }

    async get(companyId: number, applicationId: number, translationKey: string): Promise<TranslationKey> {
        let translationKeyEntity = await (this.repository as TranslationKeyRepository).findByTranslationKey(companyId, applicationId, translationKey);

        if(!translationKeyEntity){
            translationKeyEntity = new TranslationKey();
            translationKeyEntity.alias = translationKey;
        }

        return translationKeyEntity;
    }

}
