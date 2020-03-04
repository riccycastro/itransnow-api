import {AbstractEntityService} from './AbstractEntityService';
import {WhiteLabel} from '../Entities/white-label.entity';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {WhiteLabelRepository} from '../Repositories/white-label.repository';
import {WhiteLabelDto} from "../Dto/white-label.dto";
import {Application} from "../Entities/application.entity";
import {remove as removeDiacritics} from 'diacritics';
import { ApplicationService } from './application.service';
import { QueryPaginationInterface } from '../Repositories/abstract.repository';
import { Section } from '../Entities/section.entity';
import { SectionDto } from '../Dto/section.dto';

@Injectable()
export class WhiteLabelService extends AbstractEntityService<WhiteLabel> {
    private readonly applicationService: ApplicationService;
    constructor(
      whiteLabelRepository: WhiteLabelRepository,
      @Inject(forwardRef(() => ApplicationService))
        applicationService: ApplicationService,
    ) {
        super(whiteLabelRepository);
        this.applicationService = applicationService;
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

        if (await this.repository.findOne({alias: sectionAlias, application: application})) {
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

    update(whiteLabel: WhiteLabel, whiteLabelDto: WhiteLabelDto): WhiteLabel {
        whiteLabel.name = whiteLabelDto.name;
        whiteLabel.alias = whiteLabelDto.alias ?? whiteLabel.alias;
        return whiteLabel;
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
