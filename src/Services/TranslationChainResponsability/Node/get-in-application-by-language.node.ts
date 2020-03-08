import {TranslationNodeDto} from "../../../Dto/translation.dto";
import {Translation} from "../../../Entities/translation.entity";
import {TranslationService} from "../../translation.service";

export class GetInApplicationByLanguageNode {

    constructor(
        private readonly translationService: TranslationService,
    ) {
    }

    async apply(translationNodeDto: TranslationNodeDto): Promise<Translation[]> {
        return await this.translationService.getTranslationInApplicationByLanguage(translationNodeDto.application.id, translationNodeDto.language.id);
    }
}
