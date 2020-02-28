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
import {ApplicationService} from '../Services/application.service';
import {ApplicationDto} from '../Dto/application.dto';
import {AuthGuard} from '@nestjs/passport';
import {SectionDto} from '../Dto/section.dto';
import {Section} from '../Entities/section.entity';
import {Application} from '../Entities/application.entity';
import {AddLanguageToApplicationDto} from '../Dto/language.dto';

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
    return await this.applicationService.findByAlias((await req.user.company).id, alias, req.query);
  }

  @Get()
  async getApplicationsAction(@Request() req): Promise<Application[]> {
    return await this.applicationService.findInList((await req.user.company).id, req.query);
  }

  @Post()
  async createApplicationAction(@Body() createApplicationDto: ApplicationDto, @Request() req) {
    await this.applicationService.save(
      await this.applicationService.create(createApplicationDto, req.user.company),
    );
  }

  @Delete(':alias')
  async deleteApplicationAction(@Request() req, @Param('alias') alias) {
    await this.applicationService.delete(
      await this.applicationService.findByAlias((await req.user.company).id, alias),
    );
  }

  @Patch(':alias')
  async updateApplicationAction(@Request() req, @Body() updateApplicationDto: ApplicationDto, @Param('alias') alias: string) {
    await this.applicationService.update(
      await this.applicationService.findByAlias((await req.user.company).id, alias),
      updateApplicationDto,
    );
  }

  @Post(':alias/sections')
  async addSectionToApplicationAction(@Request() req, @Body() sectionDto: SectionDto, @Param('alias') alias: string): Promise<Section> {
    const section = await this.applicationService.createSection(
      await this.applicationService.findByAlias((await req.user.company).id, alias),
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
}
