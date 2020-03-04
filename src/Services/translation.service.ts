import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AbstractEntityService } from './AbstractEntityService';
import { Translation } from '../Entities/translation.entity';
import { TranslationRepository } from '../Repositories/translation.repository';
import { TranslationDto } from '../Dto/translation.dto';
import { User } from '../Entities/user.entity';
import { LanguageService } from './language.service';
import { TranslationKeyService } from './translation-key.service';
import { Connection } from 'typeorm';
import { TranslationStatusService } from './translation-status.service';
import { Application } from '../Entities/application.entity';
import { Language } from '../Entities/language.entity';
import { TranslationKey } from '../Entities/translation-key.entity';
import { TranslationStatus } from '../Entities/translation-status.entity';

@Injectable()
export class TranslationService extends AbstractEntityService<Translation> {

    private readonly languageService: LanguageService;
    private readonly translationKeyService: TranslationKeyService;
    private readonly translationStatusService: TranslationStatusService;
    private readonly connection: Connection;

    constructor(
        translationRepository: TranslationRepository,
        languageService: LanguageService,
        translationKeyService: TranslationKeyService,
        translationStatusService: TranslationStatusService,
        connection: Connection,
    ) {
        super(translationRepository);
        this.languageService = languageService;
        this.translationKeyService = translationKeyService;
        this.translationStatusService = translationStatusService;
        this.connection = connection;
    }

    create(language: Language, user: User, translationStatus: TranslationStatus, translation: string, translationKey: TranslationKey|undefined): Translation {
        const translationEntity = new Translation();
        translationEntity.language = language;
        translationEntity.createdBy = user;
        translationEntity.translation = translation;
        translationEntity.translationKey = translationKey;
        translationEntity.translationStatus = translationStatus;

        //todo@rcastro - add translation team

        return translationEntity;
    }

    async persist(user: User, application: Application, translationDto: TranslationDto): Promise<Translation> {
        const translationStatus = await this.translationStatusService.getByStatus(TranslationStatusService.APPROVAL_PENDING);
        const language = await this.languageService.getByCodeInApplication(application.id, translationDto.language);

        const translationKey = await this.translationKeyService.get(user.companyId, application.id, translationDto.translationKey);
        translationKey.application = application;

        let translation = this.create(language, user, translationStatus, translationDto.translation, translationKey);

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            translation.translationKey = await this.translationKeyService.save(translation.translationKey, queryRunner.manager);
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

    async
}
