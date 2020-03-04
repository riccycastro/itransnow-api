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
import { ApplicationService } from '../Services/application.service';
import { ApplicationDto } from '../Dto/application.dto';
import { AuthGuard } from '@nestjs/passport';
import { SectionDto } from '../Dto/section.dto';
import { Section } from '../Entities/section.entity';
import { Application } from '../Entities/application.entity';
import { AddLanguageToApplicationDto } from '../Dto/language.dto';
import { WhiteLabelDto } from '../Dto/white-label.dto';
import { WhiteLabel } from '../Entities/white-label.entity';
import { TranslationDto } from '../Dto/translation.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('applications')
export class ApplicationController {
  private readonly applicationService: ApplicationService;

  constructor(
      applicationService: ApplicationService,
  ) {
    this.applicationService = applicationService;
  }

  @Get(':alias')
  async getApplicationAction(@Request() req, @Param('alias') alias): Promise<Application> {
    return await this.applicationService.findByAlias(req.user.companyId, alias, req.query);
  }

  @Get()
  async getApplicationsAction(@Request() req): Promise<Application[]> {
    return await this.applicationService.findInList(req.user.companyId, req.query);
  }

  @Post()
  async createApplicationAction(@Body() createApplicationDto: ApplicationDto, @Request() req) {
    await this.applicationService.save(
      await this.applicationService.create(createApplicationDto, req.user.companyId),
    );
  }

  @Delete(':alias')
  async deleteApplicationAction(@Request() req, @Param('alias') alias) {
    await this.applicationService.delete(
      await this.applicationService.findByAlias(req.user.companyId, alias),
    );
  }

  @Patch(':alias')
  async updateApplicationAction(@Request() req, @Body() updateApplicationDto: ApplicationDto, @Param('alias') alias: string) {
    await this.applicationService.update(
      await this.applicationService.findByAlias(req.user.companyId, alias),
      updateApplicationDto,
    );
  }

  @Post(':alias/sections')
  async addSectionToApplicationAction(@Request() req, @Body() sectionDto: SectionDto, @Param('alias') alias: string): Promise<Section> {
    const section = await this.applicationService.createSection(
      await this.applicationService.findByAlias(req.user.companyId, alias),
      sectionDto,
    );

    section.application = undefined;

    return section;
  }

  @Post(':alias/languages')
  async addLanguageToApplicationAction(@Request() req, @Body() addLanguageToApplicationDto: AddLanguageToApplicationDto, @Param('alias') alias: string) {
    await this.applicationService.save(
        await this.applicationService.addLanguages(
            await this.applicationService.findByAlias(req.user.companyId, alias),
            addLanguageToApplicationDto,
        )
    );
  }

  @Post(':alias/white-labels')
  async addWhiteLabelToApplicationAction(@Request() req, @Body() whiteLabelDto: WhiteLabelDto, @Param('alias') alias: string): Promise<WhiteLabel> {
    const whiteLabel = await this.applicationService.createWhiteLabel(
        await this.applicationService.findByAlias(req.user.companyId, alias),
        whiteLabelDto,
    );

    whiteLabel.application = undefined;

    return whiteLabel;
  }

  @Post(':alias/translations')
  async addTranslationToApplicationAction(@Request() req, @Body() translationDto: TranslationDto, @Param('alias') alias: string) {
    await this.applicationService.createTranslation(
      req.user,
      await this.applicationService.findByAlias(req.user.companyId, alias),
      translationDto,
    );
  }
}
