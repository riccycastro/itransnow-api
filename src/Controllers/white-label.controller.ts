import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WhiteLabelService } from '../Services/white-label.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('white-labels')
export class WhiteLabelController {
  private readonly whiteLabelService: WhiteLabelService;

  constructor(whiteLabelService: WhiteLabelService) {
    this.whiteLabelService = whiteLabelService;
  }

  @Get(':alias')
  async getWhiteLabelAction(@Request() req, @Param('alias') alias: string) {
    return await this.whiteLabelService.findByAlias(req.user.companyId, alias, req.query);
  }
}
