import {Body, ClassSerializerInterceptor, Controller, Post, Request, UseGuards, UseInterceptors} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {TranslationDto} from "../Dto/translation.dto";
import {TranslationService} from "../Services/translation.service";

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

    @Post()
    async createTranslationAction(@Request() req, @Body() translationDto: TranslationDto) {
        await this.translationService.create(req.user, translationDto);
    }
}
