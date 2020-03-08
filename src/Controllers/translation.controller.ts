import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Query,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {TranslationService} from '../Services/translation.service';
import {TranslationDto} from '../Dto/translation.dto';
import {TranslationChainResponsibilityProvider} from "../Services/TranslationChainResponsability/translation-chain-responsibility.provider";

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller()
export class TranslationController {

    private readonly translationService: TranslationService;

    constructor(
        translationService: TranslationService,
        private readonly translationChainResponsibilityProvider: TranslationChainResponsibilityProvider,
    ) {
        this.translationService = translationService;
    }

    @Get(['translations', 'translations:extension'])
    async getTranslations(@Request() req, @Query() translationDto: TranslationDto, @Param('extension') extension: string) {

        translationDto.extension = extension || translationDto.extension;

        return await this.translationChainResponsibilityProvider.applyChain(
            this.translationChainResponsibilityProvider.createDynamicChain(translationDto),
            req.user.companyId,
            translationDto
        );
    }
}
