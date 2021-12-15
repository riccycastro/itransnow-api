import { ApplicationCreateType } from '../Types/application-create.type';
import { Application } from '../Entities/application.entity';
import BooleanProvider from '../../../../Core/Providers/boolean.provider';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApplicationCreatedEvent } from '../Events/application-created.event';
import { StringProvider } from '../../../../Core/Providers/string.provider';
import { ApplicationAliasExistsException } from '../Exceptions/application-alias-exists.exception';
import { User } from '../Entities/user.entity';
import DomainRepositoryInterface from '../../../../Core/Interfaces/domain.repository.interface';

Injectable();
export default class ApplicationService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject('ApplicationRepositoryInterface')
    private readonly applicationRepository: DomainRepositoryInterface<Application>,
  ) {}

  public async createApplication(
    applicationType: ApplicationCreateType,
    createdBy: User,
  ): Promise<Application> {
    let application = new Application();
    application.name = applicationType.name;
    application.alias = StringProvider.removeDiacritics(applicationType.alias);
    application.isActive = BooleanProvider.toBoolean(applicationType.isActive);
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
