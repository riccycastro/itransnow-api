import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {AbstractEntityService} from "./AbstractEntityService";
import {Translation} from "../Entities/translation.entity";
import {TranslationRepository} from "../Repositories/translation.repository";
import {TranslationDto} from "../Dto/translation.dto";
import {User} from "../Entities/user.entity";
import {LanguageService} from "./language.service";
import {TranslationKeyService} from "./translation-key.service";
import {ApplicationService} from "./application.service";
import {Connection} from "typeorm";
import {TranslationStatusService} from "./translation-status.service";

@Injectable()
export class TranslationService extends AbstractEntityService<Translation> {

    private readonly languageService: LanguageService;
    private readonly translationKeyService: TranslationKeyService;
    private readonly applicationService: ApplicationService;
    private readonly translationStatusService: TranslationStatusService;
    private readonly connection: Connection;

    constructor(
        translationRepository: TranslationRepository,
        languageService: LanguageService,
        translationKeyService: TranslationKeyService,
        applicationService: ApplicationService,
        translationStatusService: TranslationStatusService,
        connection: Connection,
    ) {
        super(translationRepository);
        this.languageService = languageService;
        this.translationKeyService = translationKeyService;
        this.applicationService = applicationService;
        this.translationStatusService = translationStatusService;
        this.connection = connection;
    }

    async create(user: User, translationDto: TranslationDto): Promise<Translation> {
        const translationStatus = await this.translationStatusService.getByStatus(TranslationStatusService.APPROVAL_PENDING);
        const application = await this.applicationService.findByAlias(user.companyId, translationDto.application);

        let translation = new Translation();
        translation.language = await this.languageService.findByCode(user.companyId, translationDto.language);

        translation.translationKey = await this.translationKeyService.get(user.companyId, application.id, translationDto.translationKey);
        translation.translationKey.application = application;
        translation.createdBy = user;
        translation.translationStatus = translationStatus;
        translation.translation = translationDto.translation;

        //todo@rcastro - add translation team

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
}