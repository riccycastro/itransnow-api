import {
  ClassSerializerInterceptor,
  Controller, Delete,
  Get,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SectionService } from '../Services/section.service';
import { Section } from '../Entities/section.entity';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('sections')
export class SectionController {
  private readonly sectionService: SectionService;

  constructor(sectionService: SectionService) {
    this.sectionService = sectionService;
  }

  @Get(':alias')
  async getSectionAction(@Request() req, @Param('alias') alias): Promise<Section> {
    return await this.sectionService.findByAlias((await req.user.company).id, alias, req.query);
  }

  @Get()
  async getSectionsAction(@Request() req): Promise<Section[]> {
    return await this.sectionService.findInList((await req.user.company).id, req.query);
  }

  @Delete(':alias')
  async deleteSectionAction(@Request() req, @Param('alias') alias) {
    await this.sectionService.delete(
      await this.sectionService.findByAlias((await req.user.company).id, alias)
    );
  }
}
