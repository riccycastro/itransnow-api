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
import { SectionService } from '../Services/section.service';
import { Section } from '../Entities/section.entity';
import { ActiveSectionDto, SectionDto } from '../Dto/section.dto';
import { TranslationKeyToSectionDto } from '../Dto/translation-key.dto';

@UseInterceptors(ClassSerializerInterceptor)
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

  @Get()
  async getSectionsAction(@Request() req): Promise<Section[]> {
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
