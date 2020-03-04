import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TranslationService } from '../Services/translation.service';

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

}
