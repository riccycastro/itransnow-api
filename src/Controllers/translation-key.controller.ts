import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TranslationKey } from '../Entities/translation-key.entity';
import { ApplicationService } from '../Services/application.service';
import { OrderDirectionEnum } from '../Repositories/abstract.repository';
import { ListResult } from '../Types/type';
import { TranslationKeyIncludesEnum, TranslationKeyService } from '../Services/translation-key.service';
import { TranslationStatusDto } from '../Dto/translation.dto';
import { JwtAuthGuard } from '../AuthGuard/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseGuards(JwtAuthGuard)
@Controller('applications/:alias/translation-keys')
export class TranslationKeyController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly translationKeyService: TranslationKeyService,
  ) {}

  @ApiQuery({ name: 'whiteLabel', required: false, type: 'string' })
  @ApiQuery({
    name: 'includes',
    required: false,
    isArray: true,
    enum: TranslationKeyIncludesEnum,
  })
  @Get(':translationKeyAlias')
  async getTranslationKeyAction(
    @Request() req,
    @Param('alias') alias: string,
    @Param('translationKeyAlias') translationKeyAlias: string,
  ): Promise<TranslationKey> {
    return this.applicationService.getTranslationKey(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      translationKeyAlias,
      req.query,
    );
  }

  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'orderField', required: false, type: 'string' })
  @ApiQuery({ name: 'name', required: false, type: 'string' })
  @ApiQuery({ name: 'alias', required: false, type: 'string' })
  @ApiQuery({
    name: 'orderDirection',
    required: false,
    type: 'string',
    enum: OrderDirectionEnum,
  })
  @ApiQuery({
    name: 'includes',
    required: false,
    isArray: true,
    enum: TranslationKeyIncludesEnum,
  })
  @ApiQuery({ name: 'whiteLabel', required: false, type: 'string' })
  @Get()
  async getTranslationKeysAction(
    @Request() req,
    @Param('alias') alias: string,
  ): Promise<ListResult<TranslationKey>> {
    return await this.applicationService.getTranslationKeys(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      req.query,
    );
  }

  @Delete(':translationKeyAlias')
  async deleteTranslationKey(
    @Request() req,
    @Param('alias') alias: string,
    @Param('translationKeyAlias') translationKeyAlias: string,
  ) {
    await this.applicationService.deleteTranslationKey(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      translationKeyAlias,
    );
  }

  @Post(':translationKeyAlias/translations/:translationAlias/status')
  async statusTranslation(
    @Body() translationStatusDto: TranslationStatusDto,
    @Request() req,
    @Param('alias') alias: string,
    @Param('translationKeyAlias') translationKeyAlias: string,
    @Param('translationAlias') translationAlias: string,
  ) {
    return await this.translationKeyService.statusTranslation(
      await this.applicationService.getTranslationKey(
        await this.applicationService.getByAliasOrFail(
          req.user.companyId,
          alias,
        ),
        translationKeyAlias,
      ),
      translationAlias,
      translationStatusDto,
      req.query,
    );
  }

  @Delete(':translationKeyAlias/translations/:translationAlias')
  async deleteTranslation(
    @Request() req,
    @Param('alias') alias: string,
    @Param('translationKeyAlias') translationKeyAlias: string,
    @Param('translationAlias') translationAlias: string,
  ) {
    await this.translationKeyService.deleteTranslation(
      await this.applicationService.getTranslationKey(
        await this.applicationService.getByAliasOrFail(
          req.user.companyId,
          alias,
        ),
        translationKeyAlias,
      ),
      translationAlias,
      req.query,
    );
  }
}
