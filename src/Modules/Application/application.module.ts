import { Module } from '@nestjs/common';
import { ApplicationController } from './Controllers/application.controller';
import ApplicationRepository from './Repositories/application.repository';
import { CreateApplicationUseCase } from './UseCase/CreateApplicationUseCase';
import { GetApplicationsUserCase } from './UseCase/GetApplicationsUserCase';

@Module({
  controllers: [ApplicationController],
  providers: [
    CreateApplicationUseCase,
    GetApplicationsUserCase,
    ApplicationRepository,
    {
      provide: 'ApplicationRepositoryInterface',
      useClass: ApplicationRepository,
    },
  ],
})
export class ApplicationModule {}
