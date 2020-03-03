import { AbstractEntityService } from './AbstractEntityService';
import { WhiteLabel } from '../Entities/white-label.entity';
import { Injectable } from '@nestjs/common';
import { WhiteLabelRepository } from '../Repositories/white-label.repository';

@Injectable()
export class WhiteLabelService extends AbstractEntityService<WhiteLabel> {
  constructor(
    whiteLabelRepository: WhiteLabelRepository,
  ) {
    super(whiteLabelRepository);
  }
}
