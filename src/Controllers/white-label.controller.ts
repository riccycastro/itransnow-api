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
import { WhiteLabelService } from '../Services/white-label.service';
import { WhiteLabel } from '../Entities/white-label.entity';
import { ActiveWhiteLabelDto, WhiteLabelDto } from '../Dto/white-label.dto';
import { WhiteLabelTranslationDto } from '../Dto/white-label-translation.dto';

@UseInterceptors(ClassSerializerInterceptor)
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

  @Get()
  async getWhiteLabelsAction(@Request() req): Promise<WhiteLabel[]> {
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
