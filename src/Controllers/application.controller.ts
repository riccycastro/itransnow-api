import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicationIncludesEnum, ApplicationService } from '../Services/application.service';
import { ActiveApplicationDto, ApplicationDto } from '../Dto/application.dto';
import { AuthGuard } from '@nestjs/passport';
import { Application } from '../Entities/application.entity';
import { LanguageToApplicationDto } from '../Dto/language.dto';
import { TranslationDto } from '../Dto/translation.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OrderDirectionEnum } from '../Repositories/abstract.repository';
import { ListResult } from '../Types/type';
import { JwtAuthGuard } from '../AuthGuard/jwt-auth.guard';
import { Translation } from '../Entities/translation.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationController {
  private readonly applicationService: ApplicationService;

  constructor(applicationService: ApplicationService) {
    this.applicationService = applicationService;
  }

  @ApiParam({ required: true, name: 'alias', type: 'string' })
  @Get(':alias')
  async getApplicationAction(
    @Request() req,
    @Param('alias') alias,
  ): Promise<Application> {
    return await this.applicationService.getByAliasOrFail(
      req.user.companyId,
      alias,
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
    enum: ApplicationIncludesEnum,
  })
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns a list of applications',
    isArray: true,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          alias: { type: 'string' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        },
      },
    },
  })
  async getApplicationsAction(
    @Request() req,
  ): Promise<ListResult<Application>> {
    return await this.applicationService.findInList(
      req.user.companyId,
      req.query,
    );
  }

  @Post()
  async createApplicationAction(
    @Body() createApplicationDto: ApplicationDto,
    @Request() req,
  ) {
    await this.applicationService.save(
      await this.applicationService.create(
        createApplicationDto,
        req.user.companyId,
      ),
    );
  }

  @ApiParam({ required: true, name: 'alias', type: 'string' })
  @Delete(':alias')
  async deleteApplicationAction(@Request() req, @Param('alias') alias) {
    await this.applicationService.delete(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
    );
  }

  @ApiParam({ required: true, name: 'alias', type: 'string' })
  @Patch(':alias')
  async updateApplicationAction(
    @Request() req,
    @Body() updateApplicationDto: ApplicationDto,
    @Param('alias') alias: string,
  ): Promise<Application> {
    return await this.applicationService.update(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      updateApplicationDto,
    );
  }

  @Patch(':alias/active')
  async activeApplicationAction(
    @Request() req,
    @Body() activeApplicationDto: ActiveApplicationDto,
    @Param(':alias') alias: string,
  ): Promise<Application> {
    return await this.applicationService.save(
      this.applicationService.active(
        await this.applicationService.getByAliasOrFail(
          req.user.companyId,
          alias,
        ),
        activeApplicationDto,
      ),
    );
  }

  @Post(':alias/languages')
  async addLanguageToApplicationAction(
    @Request() req,
    @Body() addLanguageToApplicationDto: LanguageToApplicationDto,
    @Param('alias') alias: string,
  ): Promise<Application> {
    return await this.applicationService.addLanguages(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      addLanguageToApplicationDto,
    );
  }

  @Delete(':alias/languages')
  async removeLanguageFromApplicationAction(
    @Request() req,
    @Body() removeLanguageToApplicationDto: LanguageToApplicationDto,
    @Param('alias') alias: string,
  ) {
    return await this.applicationService.save(
      await this.applicationService.removeLanguages(
        await this.applicationService.getByAliasOrFail(
          req.user.companyId,
          alias,
        ),
        removeLanguageToApplicationDto,
      ),
    );
  }

  @Post(':alias/translations')
  async addTranslationToApplicationAction(
    @Request() req,
    @Body() translationDto: TranslationDto,
    @Param('alias') alias: string,
  ) {
    await this.applicationService.createTranslation(
      req.user,
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      translationDto,
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
  @ApiResponse({
    status: 200,
    description: 'Returns a list of a application translations',
    isArray: true,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          alias: { type: 'string' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        },
      },
    },
  })
  @Get(':alias/translations/:languageCode')
  async getTranslations(
    @Request() req,
    @Param('alias') alias: string,
    @Param('languageCode') languageCode: string,
  ): Promise<ListResult<Translation>> {
      return await this.applicationService.getTranslations(
        await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
        languageCode,
        req.query
      )
  }
}
