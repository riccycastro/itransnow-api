import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {SectionService} from '../Services/section.service';
import {Section} from '../Entities/section.entity';
import {SectionDto} from '../Dto/section.dto';

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
  async deleteSectionAction(@Request() req, @Param('alias') alias: string) {
    await this.sectionService.delete(
      await this.sectionService.findByAlias(req.user.companyId, alias)
    );
  }

  @Patch(':alias')
  async updateSectionAction(@Request() req, @Body() sectionDto: SectionDto, @Param('alias') alias: string) {
    return await this.sectionService.update(
      await this.sectionService.findByAlias(req.user.companyId, alias),
      sectionDto,
    );
  }
}
