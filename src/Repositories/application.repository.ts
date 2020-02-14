import { EntityRepository, Repository } from 'typeorm';
import { Application } from '../Entities/application.entity';

@EntityRepository(Application)
export class ApplicationRepository extends Repository<Application> {

}
