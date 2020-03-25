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
import { SectionIncludesEnum, SectionService } from '../Services/section.service';
import { Section } from '../Entities/section.entity';
import { ActiveSectionDto, SectionDto } from '../Dto/section.dto';
import { TranslationKeyToSectionDto } from '../Dto/translation-key.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrderDirectionEnum } from '../Repositories/abstract.repository';
import { ListResult } from '../Types/type';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('sections')
export class SectionController {
  private readonly sectionService: SectionService;

  constructor(sectionService: SectionService) {
    this.sectionService = sectionService;
  }

  @Get(':alias')
  async getSectionAction(@Request() req, @Param('alias') alias: string): Promise<Section> {
    return await this.sectionService.findByAlias(req.user.companyId, alias, req.query);
  }

  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'orderField', required: false, type: 'string' })
  @ApiQuery({ name: 'name', required: false, type: 'string' })
  @ApiQuery({ name: 'alias', required: false, type: 'string' })
  @ApiQuery({ name: 'orderDirection', required: false, type: 'string', enum: OrderDirectionEnum })
  @ApiQuery({ name: 'includes', required: false, isArray: true, enum: SectionIncludesEnum })
  @Get()
  async getSectionsAction(@Request() req): Promise<ListResult<Section>> {
    return await this.sectionService.findInList(req.user.companyId, req.query);
  }

  @Delete(':alias')
  async deleteSectionAction(@Request() req, @Param('alias') alias: string): Promise<void> {
    await this.sectionService.save(
      this.sectionService.delete(
        await this.sectionService.findByAlias(req.user.companyId, alias),
      ),
    );
  }

  @Patch(':alias')
  async updateSectionAction(@Request() req, @Body() sectionDto: SectionDto, @Param('alias') alias: string): Promise<Section> {
    return await this.sectionService.update(
      await this.sectionService.findByAlias(req.user.companyId, alias),
      sectionDto,
    );
  }

  @Patch(':alias/active')
  async activeSectionAction(@Request() req, @Body() activeSectionDto: ActiveSectionDto, @Param('alias') alias: string): Promise<Section> {
    return await this.sectionService.save(
      await this.sectionService.active(
        await this.sectionService.findByAlias(req.user.companyId, alias),
        activeSectionDto,
      ),
    );
  }

  @Post(':alias/translation-keys')
  async addTranslationKeyToSectionAction(@Request() req, @Body() addTranslationKeyToSectionDto: TranslationKeyToSectionDto, @Param('alias') alias: string): Promise<void> {
    await this.sectionService.addTranslationKeys(
      req.user.companyId,
      await this.sectionService.findByAlias(req.user.companyId, alias),
      addTranslationKeyToSectionDto,
    );
  }

  @Delete(':alias/translation-keys')
  async removeTranslationKeyToSectionAction(@Request() req, @Body() removeTranslationKeyToSectionDto: TranslationKeyToSectionDto, @Param('alias') alias: string): Promise<void> {
    await this.sectionService.removeTranslationKeys(
      req.user.companyId,
      await this.sectionService.findByAlias(req.user.companyId, alias),
      removeTranslationKeyToSectionDto,
    );
  }
}
