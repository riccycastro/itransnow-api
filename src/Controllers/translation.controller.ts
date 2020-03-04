import {
    ClassSerializerInterceptor,
    Controller,
    Get,
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
@Controller('translations')
export class TranslationController {

    private readonly translationService: TranslationService;

    constructor(
        translationService: TranslationService
    ) {
        this.translationService = translationService;
    }

    @Get('translations')
    getTranslations(@Request() req, @Query() translationDto: TranslationDto) {

    }
}
