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
import { AuthGuard } from '@nestjs/passport';
import { Section } from '../Entities/section.entity';
import { ActiveSectionDto, SectionDto } from '../Dto/section.dto';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApplicationService } from '../Services/application.service';
import { OrderDirectionEnum } from '../Repositories/abstract.repository';
import { SectionIncludesEnum, SectionService } from '../Services/section.service';
import { ListResult } from '../Types/type';
import { TranslationKeyToSectionDto } from '../Dto/translation-key.dto';
import { JwtAuthGuard } from '../AuthGuard/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseGuards(JwtAuthGuard)
@Controller('applications/:alias/sections')
export class SectionController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly sectionService: SectionService,
  ) {
  }

  @ApiParam({ required: true, name: 'alias', type: 'string' })
  @Post()
  async addSectionToApplicationAction(
    @Request() req,
    @Body() sectionDto: SectionDto,
    @Param('alias') alias: string,
  ): Promise<Section> {
    const section = await this.applicationService.createSection(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      sectionDto,
    );

    section.application = undefined;

    return section;
  }

  @Patch(':sectionAlias')
  async updateSectionAction(
    @Request() req,
    @Body() sectionDto: SectionDto,
    @Param('alias') alias: string,
    @Param('sectionAlias') sectionAlias: string,
  ): Promise<Section> {
    return this.applicationService.updateSection(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      sectionDto,
      sectionAlias,
    );
  }

  @Get(':sectionAlias')
  async getSectionAction(
    @Request() req,
    @Param('alias') alias: string,
    @Param('sectionAlias') sectionAlias: string,
  ): Promise<Section> {
    return this.applicationService.getSection(
      await this.applicationService.getByAliasOrFail(
        req.user.companyId,
        alias,
      ),
      sectionAlias,
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
    enum: SectionIncludesEnum,
  })
  @Get()
  async getSectionsAction(
    @Request() req,
    @Param('alias') alias: string,
  ): Promise<ListResult<Section>> {
    return await this.applicationService.getSections(
      await this.applicationService.getByAliasOrFail(
        req.user.companyId,
        alias),
      req.query);
  }

  @Delete(':sectionAlias')
  async deleteSectionAction(
    @Request() req,
    @Param('alias') alias: string,
    @Param('sectionAlias') sectionAlias: string,
  ): Promise<void> {
    await this.applicationService.deleteSection(
      await this.applicationService.getByAliasOrFail(
        req.user.companyId,
        alias,
      ),
      sectionAlias,
    );
  }

  @Patch(':sectionAlias/active')
  async activeSectionAction(
    @Request() req,
    @Body() activeSectionDto: ActiveSectionDto,
    @Param('alias') alias: string,
    @Param('sectionAlias') sectionAlias: string,
  ): Promise<Section> {
    return await this.applicationService.activeSection(
      await this.applicationService.getByAliasOrFail(
        req.user.companyId,
        alias,
      ),
      sectionAlias,
      activeSectionDto,
    );
  }

  @Post(':sectionAlias/translation-keys')
  async addTranslationKeyToSectionAction(
    @Request() req,
    @Body() addTranslationKeyToSectionDto: TranslationKeyToSectionDto,
    @Param('alias') alias: string,
    @Param('sectionAlias') sectionAlias: string,
  ): Promise<void> {
    await this.sectionService.addTranslationKeys(
      req.user.companyId,
      await this.applicationService.getSection(
        await this.applicationService.getByAliasOrFail(
          req.user.companyId,
          alias,
        ),
        sectionAlias),
      addTranslationKeyToSectionDto,
    );
  }

  @Delete(':sectionAlias/translation-keys')
  async removeTranslationKeyToSectionAction(
    @Request() req,
    @Body() removeTranslationKeyToSectionDto: TranslationKeyToSectionDto,
    @Param('alias') alias: string,
    @Param('sectionAlias') sectionAlias: string,
  ): Promise<void> {
    await this.sectionService.removeTranslationKeys(
      req.user.companyId,
      await this.applicationService.getSection(
        await this.applicationService.getByAliasOrFail(
          req.user.companyId,
          alias,
        ),
        sectionAlias),
      removeTranslationKeyToSectionDto,
    );
  }
}
