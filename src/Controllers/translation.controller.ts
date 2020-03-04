import {
    ClassSerializerInterceptor,
    Controller,
    Get, Param,
    Query,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TranslationService } from '../Services/translation.service';
import { TranslationDto } from '../Dto/translation.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller()
export class TranslationController {

    private readonly translationService: TranslationService;

    constructor(
        translationService: TranslationService
    ) {
        this.translationService = translationService;
    }

    @Get(['translations', 'translations:extension'])
    getTranslations(@Request() req, @Query() translationDto: TranslationDto, @Param('extension') extension: string) {
        console.log(extension)
    }
}
