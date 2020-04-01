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
import { AbstractEntityListingService } from './AbstractEntityListingService';
import { MomentProvider } from './Provider/moment.provider';
import { QueryRunnerProvider } from './Provider/query-runner.provider';

export enum WhiteLabelIncludesEnum {
    application = 'application',
}

@Injectable()
export class WhiteLabelService extends AbstractEntityListingService<WhiteLabel> {
    private readonly applicationService: ApplicationService;
    private readonly languageService: LanguageService;
    private readonly translationKeyService: TranslationKeyService;
    private readonly translationService: TranslationService;
    private readonly translationStatusService: TranslationStatusService;

    constructor(
      whiteLabelRepository: WhiteLabelRepository,
      @Inject(forwardRef(() => ApplicationService))
        applicationService: ApplicationService,
      languageService: LanguageService,
      translationKeyService: TranslationKeyService,
      @Inject(forwardRef(() => TranslationService))
        translationService: TranslationService,
      translationStatusService: TranslationStatusService,
      private readonly queryRunnerProvider: QueryRunnerProvider,
      private readonly momentProvider: MomentProvider,
    ) {
        super(whiteLabelRepository);
        this.applicationService = applicationService;
        this.languageService = languageService;
        this.translationKeyService = translationKeyService;
        this.translationService = translationService;
        this.translationStatusService = translationStatusService;
    }

    async findByAliasOrFail(companyId: number, alias: string, query?: any): Promise<WhiteLabel> {
        const whiteLabel = await this.findByAlias(companyId, alias);

        if (!whiteLabel) {
            throw new NotFoundException('WhiteLabel not found!');
        }

        return await this.getIncludes(companyId, whiteLabel, query);
    }

    private async findByAlias(companyId: number, alias: string): Promise<WhiteLabel> {
        return await (this.repository as WhiteLabelRepository).findByAlias(companyId, alias);
    }

    async getByApplication(companyId: number, applicationId: number, query: QueryPaginationInterface): Promise<WhiteLabel[]> {
        return await (this.repository as WhiteLabelRepository).findByApplication(companyId, applicationId, query);
    }

    protected async getEntityListAndCount(companyId: number, query?: QueryPaginationInterface): Promise<[WhiteLabel[], number]> {
        const listResult = await (this.repository as WhiteLabelRepository).findInList(companyId, query);

        for (let whiteLabel of listResult[0]) {
            whiteLabel = await this.getIncludes(companyId, whiteLabel, query);
        }

        return listResult;
    }

    async create(whiteLabelDto: WhiteLabelDto, application: Application): Promise<WhiteLabel> {
        const sectionAlias = removeDiacritics(whiteLabelDto.alias.trim().replace(/ /g, '_')).toLowerCase();

        if (await this.repository.findOne({ alias: sectionAlias, application: application, deletedAt: 0 })) {
            throw new BadRequestException(`White label with alias "${whiteLabelDto.alias}" already exists in ${application.name} application`);
        }

        const whiteLabel = new WhiteLabel();
        whiteLabel.name = whiteLabelDto.name;
        whiteLabel.alias = whiteLabelDto.alias;
        whiteLabel.application = application;
        return whiteLabel;
    }

    delete(whiteLabel: WhiteLabel): WhiteLabel {
        whiteLabel.deletedAt = this.momentProvider.utc().unix();
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

    async createWhiteLabelTranslation(user: User, whiteLabel: WhiteLabel, whiteLabelTranslationDto: WhiteLabelTranslationDto): Promise<WhiteLabelTranslation> {
        const language = await this.languageService.getByCodeInApplication(whiteLabel.applicationId, whiteLabelTranslationDto.language);
        const translationStatus = await this.translationStatusService.getByStatus(TranslationStatusService.APPROVAL_PENDING);
        const translationKey = await this.translationKeyService.getByTranslationKeyInApplication(user.companyId, whiteLabel.applicationId, whiteLabelTranslationDto.translationKey);

        const translation = this.translationService.create(language, user, translationStatus, whiteLabelTranslationDto.translation);

        const queryRunner = this.queryRunnerProvider.createQueryRunner();
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
            whiteLabel.application = await this.applicationService.getById(whiteLabel.applicationId);
        }

        return whiteLabel;
    }
}
