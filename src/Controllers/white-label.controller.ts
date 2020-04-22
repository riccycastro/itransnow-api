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
import { WhiteLabelIncludesEnum } from '../Services/white-label.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ActiveWhiteLabelDto, WhiteLabelDto } from '../Dto/white-label.dto';
import { WhiteLabel } from '../Entities/white-label.entity';
import { OrderDirectionEnum } from '../Repositories/abstract.repository';
import { ListResult } from '../Types/type';
import { WhiteLabelTranslationDto } from '../Dto/white-label-translation.dto';
import { ApplicationService } from '../Services/application.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('applicaotion/:alias/white-labels')
export class WhiteLabelController {

  constructor(private readonly applicationService: ApplicationService) {
  }

  @Post()
  async addWhiteLabelToApplicationAction(
    @Request() req,
    @Body() whiteLabelDto: WhiteLabelDto,
    @Param('alias') alias: string,
  ): Promise<WhiteLabel> {
    const whiteLabel = await this.applicationService.createWhiteLabel(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      whiteLabelDto,
    );

    whiteLabel.application = undefined;

    return whiteLabel;
  }

  @Patch(':whiteLabelAlias')
  async updateWhiteLabelAction(
    @Request() req,
    @Body() whiteLabelDto: WhiteLabelDto,
    @Param('alias') alias: string,
    @Param('whiteLabelAlias') whiteLabelAlias: string,
  ) {
    return await this.applicationService.updateWhiteLabel(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      whiteLabelDto,
      whiteLabelAlias,
    );
  }

  @Get(':whiteLabelAlias')
  async getWhiteLabelAction(
    @Request() req,
    @Param('alias') alias: string,
    @Param('whiteLabelAlias') whiteLabelAlias: string,
  ): Promise<WhiteLabel> {
    return await this.applicationService.getWhiteLabel(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      whiteLabelAlias,
      req.query,
    );
  }

  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'orderField', required: false, type: 'string' })
  @ApiQuery({ name: 'name', required: false, type: 'string' })
  @ApiQuery({ name: 'alias', required: false, type: 'string' })
  @ApiQuery({ name: 'orderDirection', required: false, type: 'string', enum: OrderDirectionEnum })
  @ApiQuery({ name: 'includes', required: false, isArray: true, enum: WhiteLabelIncludesEnum })
  @Get()
  async getWhiteLabelsAction(@Request() req, @Param('alias') alias: string): Promise<ListResult<WhiteLabel>> {
    return await this.applicationService.getWhiteLabels(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      req.query,
    );
  }

  @Delete(':whiteLabelAlias')
  async deleteWhiteLabelAction(
    @Request() req,
    @Param('alias') alias: string,
    @Param('whiteLabelAlias') whiteLabelAlias: string,
  ): Promise<void> {
    await this.applicationService.deleteWhiteLabel(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      whiteLabelAlias,
    );
  }

  @Post(':whiteLabelAlias/translations')
  async addTranslationToWhiteLabel(
    @Request() req,
    @Body() whiteLabelTranslationDto: WhiteLabelTranslationDto,
    @Param('alias') alias: string,
    @Param('whiteLabelAlias') whiteLabelAlias: string,
  ): Promise<void> {
    await this.applicationService.addTranslationToWhiteLabel(
      req.user,
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      whiteLabelAlias,
      whiteLabelTranslationDto,
    );
  }

  @Patch(':whiteLabelAlias/active')
  async activeWhiteLabelAction(
    @Request() req,
    @Body() activeWhiteLabelDto: ActiveWhiteLabelDto,
    @Param(':alias') alias: string,
    @Param('whiteLabelAlias') whiteLabelAlias: string,
  ): Promise<WhiteLabel> {
    return await this.applicationService.activeWhiteLabel(
      await this.applicationService.getByAliasOrFail(req.user.companyId, alias),
      whiteLabelAlias,
      activeWhiteLabelDto,
    );
  }
}
