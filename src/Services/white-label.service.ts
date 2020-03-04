import {AbstractEntityService} from './AbstractEntityService';
import {WhiteLabel} from '../Entities/white-label.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {WhiteLabelRepository} from '../Repositories/white-label.repository';
import {WhiteLabelDto} from "../Dto/white-label.dto";
import {Application} from "../Entities/application.entity";
import {remove as removeDiacritics} from 'diacritics';

@Injectable()
export class WhiteLabelService extends AbstractEntityService<WhiteLabel> {
    constructor(
        whiteLabelRepository: WhiteLabelRepository,
    ) {
        super(whiteLabelRepository);
    }

    async findByAlias(companyId: number, alias: string, query?: any): Promise<WhiteLabel> {
        const whiteLabel = await (this.repository as WhiteLabelRepository).findByAlias(companyId, alias);

        if (!whiteLabel) {
            throw new NotFoundException('WhiteLabel not found!');
        }

        // todo@rcastro - add includes(application)
        return await this.getIncludes(companyId, whiteLabel, query);
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
}
