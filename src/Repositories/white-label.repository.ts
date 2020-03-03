import { EntityRepository, Repository } from 'typeorm';
import { WhiteLabel } from '../Entities/white-label.entity';

@EntityRepository(WhiteLabel)
export class WhiteLabelRepository extends Repository<WhiteLabel> {

}
