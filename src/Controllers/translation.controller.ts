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
import { AuthGuard } from '@nestjs/passport';
import { TranslationService } from '../Services/translation.service';
import { TranslationDto } from '../Dto/translation.dto';
import { TranslationStrategyProvider } from '../Services/Provider/translation-strategy.provider';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller()
export class TranslationController {

    private readonly translationService: TranslationService;

    constructor(
      translationService: TranslationService,
      private readonly translationStrategyProvider: TranslationStrategyProvider,
    ) {
        this.translationService = translationService;
    }

    @Get(['translations', 'translations:extension'])
    async getTranslations(@Request() req, @Query() translationDto: TranslationDto, @Param('extension') extension: string) {
        const strategy = await this.translationStrategyProvider.getStrategy(req.user.companyId, translationDto);
        return await strategy.get();
    }
}
