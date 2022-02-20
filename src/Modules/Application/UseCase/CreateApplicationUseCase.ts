import { User } from '../Entities/user.entity';
import { Application } from '../Entities/application.entity';
import { StringProvider } from '../../../Core/Providers/string.provider';
import BooleanProvider from '../../../Core/Providers/boolean.provider';
import { ApplicationAliasExistsException } from '../Exceptions/application-alias-exists.exception';
import { ApplicationCreatedEvent } from '../Events/application-created.event';
import DomainRepositoryInterface from '../../../Core/Interfaces/domain.repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { ApplicationInputDto } from '../Dtos/application-input.dto';

@Injectable()
export class CreateApplicationUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject('ApplicationRepositoryInterface')
    private readonly applicationRepository: DomainRepositoryInterface<Application>,
  ) {}

  async run(
    applicationInputDto: ApplicationInputDto,
    createdBy: User,
  ): Promise<Application> {
    let application = new Application();
    application.name = applicationInputDto.name;
    application.alias = StringProvider.removeDiacritics(
      applicationInputDto.alias,
    );
    application.isActive = BooleanProvider.toBoolean(
      applicationInputDto.isActive,
    );
    application.createdBy = createdBy;

    if (
      await this.applicationRepository.findOne(null, {
        where: { alias: application.alias },
      })
    ) {
      throw new ApplicationAliasExistsException(application.alias);
    }

    application = (await this.applicationRepository.save(
      application,
    )) as Application;

    this.eventEmitter.emit(
      'application.created',
      new ApplicationCreatedEvent(application.id),
    );

    return application;
  }
}
