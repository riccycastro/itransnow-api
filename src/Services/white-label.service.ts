import { AbstractEntityService } from './AbstractEntityService';
import { WhiteLabel } from '../Entities/white-label.entity';
import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { WhiteLabelRepository } from '../Repositories/white-label.repository';
import { ActiveWhiteLabelDto, WhiteLabelDto } from '../Dto/white-label.dto';
import { Application } from '../Entities/application.entity';
import { remove as removeDiacritics } from 'diacritics';
import { ApplicationService } from './application.service';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';
import { WhiteLabelTranslationDto } from '../Dto/white-label-translation.dto';
import { LanguageService } from './language.service';
import { User } from '../Entities/user.entity';
import { TranslationKeyService } from './translation-key.service';
import { WhiteLabelTranslation } from '../Entities/white-label-translation.entity';
import { TranslationService } from './translation.service';
import { TranslationStatusService } from './translation-status.service';
import { Connection } from 'typeorm';

@Injectable()
export class WhiteLabelService extends AbstractEntityService<WhiteLabel> {
    private readonly applicationService: ApplicationService;
    private readonly languageService: LanguageService;
    private readonly translationKeyService: TranslationKeyService;
    private readonly translationService: TranslationService;
    private readonly translationStatusService: TranslationStatusService;
    private readonly connection: Connection;

    constructor(
      whiteLabelRepository: WhiteLabelRepository,
      @Inject(forwardRef(() => ApplicationService))
        applicationService: ApplicationService,
      languageService: LanguageService,
      translationKeyService: TranslationKeyService,
      translationService: TranslationService,
      translationStatusService: TranslationStatusService,
      connection: Connection,
    ) {
        super(whiteLabelRepository);
        this.applicationService = applicationService;
        this.languageService = languageService;
        this.translationKeyService = translationKeyService;
        this.translationService = translationService;
        this.translationStatusService = translationStatusService;
        this.connection = connection;
    }

    async findByAlias(companyId: number, alias: string, query?: any): Promise<WhiteLabel> {
        const whiteLabel = await (this.repository as WhiteLabelRepository).findByAlias(companyId, alias);

        if (!whiteLabel) {
            throw new NotFoundException('WhiteLabel not found!');
        }

        return await this.getIncludes(companyId, whiteLabel, query);
    }

    async findByApplication(companyId: number, applicationId: number, query: QueryPaginationInterface): Promise<WhiteLabel[]> {
        return await (this.repository as WhiteLabelRepository).findByApplication(companyId, applicationId, query);
    }

    async findInList(companyId: number, query?: QueryPaginationInterface): Promise<WhiteLabel[]> {
        const whiteLabels = await (this.repository as WhiteLabelRepository).findInList(companyId, query);

        for (const whiteLabelsKey in whiteLabels) {
            whiteLabels[whiteLabelsKey] = await this.getIncludes(companyId, whiteLabels[whiteLabelsKey], query);
        }

        return whiteLabels;
    }

    async create(whiteLabelDto: WhiteLabelDto, application: Application): Promise<WhiteLabel> {
        const sectionAlias = removeDiacritics(whiteLabelDto.alias.trim().replace(/ /g, '_')).toLowerCase();

        if (await this.repository.findOne({ alias: sectionAlias, application: application })) {
            throw new BadRequestException(`White label with alias "${whiteLabelDto.alias}" already exists in ${application.name} application`);
        }

        const whiteLabel = new WhiteLabel();
        whiteLabel.name = whiteLabelDto.name;
        whiteLabel.alias = whiteLabelDto.alias;
        whiteLabel.application = application;
        return whiteLabel;
    }

    delete(whiteLabel: WhiteLabel): WhiteLabel {
        whiteLabel.isDeleted = true;
        return whiteLabel;
    }

    active(whiteLabel: WhiteLabel, whiteLabelDto: ActiveWhiteLabelDto): WhiteLabel {
        whiteLabel.isActive = whiteLabelDto.isActive;
        return whiteLabel;
    }

    update(whiteLabel: WhiteLabel, whiteLabelDto: WhiteLabelDto): WhiteLabel {
        whiteLabel.name = whiteLabelDto.name;
        whiteLabel.alias = whiteLabelDto.alias ?? whiteLabel.alias;
        return whiteLabel;
    }

    async createWhiteLabelTranslation(user: User, whiteLabel: WhiteLabel, whiteLabelTranslationDto: WhiteLabelTranslationDto) {
        const language = await this.languageService.getByCodeInApplication(whiteLabel.applicationId, whiteLabelTranslationDto.language);
        const translationStatus = await this.translationStatusService.getByStatus(TranslationStatusService.APPROVAL_PENDING);
        const translationKey = await this.translationKeyService.getByTranslationKeyInApplication(user.companyId, whiteLabel.applicationId, whiteLabelTranslationDto.translationKey);

        const translation = this.translationService.create(language, user, translationStatus, whiteLabelTranslationDto.translation);

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            let whiteLabelTranslation = new WhiteLabelTranslation();

            whiteLabelTranslation.translation = await this.translationService.save(translation, queryRunner.manager);
            whiteLabelTranslation.translationKey = translationKey;
            whiteLabelTranslation.whiteLabel = whiteLabel;

            whiteLabelTranslation = await queryRunner.manager.save(whiteLabelTranslation);

            await queryRunner.commitTransaction();
            await queryRunner.release();

            return whiteLabelTranslation;
        } catch (e) {
            console.log(e.message);
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new InternalServerErrorException();
        }
    }

    async getIncludes(companyId: number, whiteLabel: WhiteLabel, query: any): Promise<WhiteLabel> {
        if (!query || !query.includes) {
            return whiteLabel;
        }

        if (query.includes.includes('application')) {
            whiteLabel.application = await this.applicationService.findById(whiteLabel.applicationId);
        }

        return whiteLabel;
    }
}
