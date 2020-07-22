import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TranslationService } from '../Services/translation.service';
import { TranslationDto, TranslationStatusDto } from '../Dto/translation.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TranslationStatusEnum, TranslationStatusService } from '../Services/translation-status.service';
import { JwtAuthGuard } from '../AuthGuard/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseGuards(JwtAuthGuard)
@Controller()
export class TranslationController {
  private readonly translationService: TranslationService;

  constructor(translationService: TranslationService) {
    this.translationService = translationService;
  }

  @Get('translations')
  async getTranslationsAction(
    @Request() req,
    @Query() translationDto: TranslationDto,
  ) {
    return await this.getTranslationData(req.user.companyId, translationDto);
  }

  @Get('translations.json')
  async getTranslationsJsonFile(
    @Request() req,
    @Query() translationDto: TranslationDto,
    @Res() res: Response,
  ) {
    const data = await this.getTranslationData(
      req.user.companyId,
      translationDto,
    );

    res.setHeader(
      'Content-disposition',
      'attachment; filename=translation.json',
    );
    res.setHeader('Content-type', 'application/json');
    res.write(data, err => {
      if (err) {
        this.throwDownloadFileError();
      }
      res.end();
    });
  }

  @Get('translations.yaml')
  async getTranslationsYamlFile(
    @Request() req,
    @Query() translationDto: TranslationDto,
    @Res() res: Response,
  ) {
    const data = await this.getTranslationData(
      req.user.companyId,
      translationDto,
    );

    res.setHeader(
      'Content-disposition',
      'attachment; filename=translation.yaml',
    );
    res.setHeader('Content-type', 'text/yaml');
    res.write(data, err => {
      if (err) {
        this.throwDownloadFileError();
      }
      res.end();
    });
  }

  @ApiQuery({
    name: 'status',
    required: false,
    isArray: true,
    enum: TranslationStatusEnum,
  })
  @Get('translations/status/next')
  async nextStatusAction(
    @Query() translationStatusDto: TranslationStatusDto,
  ): Promise<string[]> {
    return TranslationStatusService.statusTranslationStateMachine(
      translationStatusDto.status,
    );
  }

  private async getTranslationData(
    companyId: number,
    translationDto: TranslationDto,
  ) {
    return await this.translationService.getTranslations(
      companyId,
      translationDto,
    );
  }

  private throwDownloadFileError() {
    throw new InternalServerErrorException(
      'Something when wrong while trying to download your translation file',
    );
  }
}
