import { ApplicationService } from '../application.service';
import { LanguageService } from '../language.service';
import { TranslationService } from '../translation.service';
import { TranslationDto, TranslationNodeDto } from '../../Dto/translation.dto';
import { Injectable } from '@nestjs/common';
import { GetInApplicationByLanguageNode } from './Node/get-in-application-by-language.node';
import { FlatIndexNode } from './Node/flat-index.node';
import { NestedIndexNode } from './Node/nested-index.node';
import { ConvertToYamlNode } from './Node/convert-to-yaml.node';

@Injectable()
export class TranslationChainResponsibilityProvider {
    static readonly NODE_GET_IN_APPLICATION_BY_LANGUAGE = "get-in-application-by-language.node";
    static readonly NODE_FLAT_INDEX = "flat-index.node";
    static readonly NODE_NESTED_INDEX = "nested-index.node";
    static readonly NODE_FILE_YAML = 'file.yaml.node';

    private indexValidOptions = ['flat', 'nested'];
    private fileValidExtensions = ['.yaml'];

    constructor(
      private readonly applicationService: ApplicationService,
      private readonly languageService: LanguageService,
      private readonly translationService: TranslationService,
    ) {
    }

    createDynamicChain(translationDto: TranslationDto): string[] {
        const sequence: string[] = [];

        sequence.push(TranslationChainResponsibilityProvider.NODE_GET_IN_APPLICATION_BY_LANGUAGE);

        if (translationDto.indexType && this.indexValidOptions.includes(translationDto.indexType)) {
            sequence.push(`${translationDto.indexType}-index.node`)
        } else {
            sequence.push(TranslationChainResponsibilityProvider.NODE_FLAT_INDEX);
        }

        if (this.fileValidExtensions.includes(translationDto.extension)) {
            sequence.push(`file${translationDto.extension}.node`)
        }

        return sequence;
    }

    async applyChain(sequence: string[], companyId: number, translationDto: TranslationDto) {

        const translationNodeDto = new TranslationNodeDto();
        translationNodeDto.application = await this.applicationService.findByAlias(companyId, translationDto.application);
        translationNodeDto.language = await this.languageService.getByCodeInApplication(translationNodeDto.application.id, translationDto.language);
        translationNodeDto.translationKeys = translationDto.translationKey ? translationDto.translationKey.split(',') : undefined;
        translationNodeDto.sections = translationDto.section ? translationDto.section.split(',') : undefined;

        let data: any = {};

        for (const nodeName of sequence) {
            data = await this.execNode(nodeName, data, translationNodeDto);
        }

        return data;
    }

    private async execNode(nodeName: string, data: any, translationNodeDto: TranslationNodeDto) {
        switch (nodeName) {
            case TranslationChainResponsibilityProvider.NODE_GET_IN_APPLICATION_BY_LANGUAGE:
                return await (new GetInApplicationByLanguageNode(this.translationService)).apply(translationNodeDto);
            case TranslationChainResponsibilityProvider.NODE_FLAT_INDEX:
                return (new FlatIndexNode()).apply(data);
            case TranslationChainResponsibilityProvider.NODE_NESTED_INDEX:
                return (new NestedIndexNode()).apply(data);
            case TranslationChainResponsibilityProvider.NODE_FILE_YAML:
                return (new ConvertToYamlNode()).apply(data);
        }
    }
}
