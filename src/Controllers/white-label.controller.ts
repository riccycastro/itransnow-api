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
import { WhiteLabelIncludesEnum, WhiteLabelService } from '../Services/white-label.service';
import { WhiteLabel } from '../Entities/white-label.entity';
import { ActiveWhiteLabelDto, WhiteLabelDto } from '../Dto/white-label.dto';
import { WhiteLabelTranslationDto } from '../Dto/white-label-translation.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrderDirectionEnum } from '../Repositories/abstract.repository';
import { ListResult } from '../Types/type';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('white-labels')
export class WhiteLabelController {
  private readonly whiteLabelService: WhiteLabelService;

  constructor(whiteLabelService: WhiteLabelService) {
    this.whiteLabelService = whiteLabelService;
  }

  @Get(':alias')
  async getWhiteLabelAction(@Request() req, @Param('alias') alias: string): Promise<WhiteLabel> {
    return await this.whiteLabelService.findByAlias(req.user.companyId, alias, req.query);
  }

  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'orderField', required: false, type: 'string' })
  @ApiQuery({ name: 'name', required: false, type: 'string' })
  @ApiQuery({ name: 'alias', required: false, type: 'string' })
  @ApiQuery({ name: 'orderDirection', required: false, type: 'string', enum: OrderDirectionEnum })
  @ApiQuery({ name: 'includes', required: false, isArray: true, enum: WhiteLabelIncludesEnum })
  @Get()
  async getWhiteLabelsAction(@Request() req): Promise<ListResult<WhiteLabel>> {
    return await this.whiteLabelService.findInList(req.user.companyId, req.query);
  }

  @Delete(':alias')
  async deleteWhiteLabelAction(@Request() req, @Param('alias') alias: string): Promise<void> {
    await this.whiteLabelService.save(
      this.whiteLabelService.delete(
        await this.whiteLabelService.findByAlias(req.user.companyId, alias),
      ),
    );
  }

  @Patch(':alias')
  async updateWhiteLabelAction(@Request() req, @Body() whiteLabelDto: WhiteLabelDto, @Param('alias') alias: string): Promise<WhiteLabel> {
    return await this.whiteLabelService.save(
      this.whiteLabelService.update(
        await this.whiteLabelService.findByAlias(req.user.companyId, alias),
        whiteLabelDto,
      ),
    );
  }

  @Post(':alias/translations')
  async addTranslationToWhiteLabel(@Request() req, @Body() whiteLabelTranslationDto: WhiteLabelTranslationDto, @Param('alias') alias: string) {
    await this.whiteLabelService.createWhiteLabelTranslation(
      req.user,
      await this.whiteLabelService.findByAlias(req.user.companyId, alias),
      whiteLabelTranslationDto
    );
  }

  @Patch(':alias/active')
  async activeSectionAction(@Request() req, @Body() activeWhiteLabelDto: ActiveWhiteLabelDto, @Param(':alias') alias: string): Promise<WhiteLabel> {
    return await this.whiteLabelService.save(
      await this.whiteLabelService.active(
        await this.whiteLabelService.findByAlias(req.user.companyId, alias),
        activeWhiteLabelDto,
      ),
    );
  }
}
