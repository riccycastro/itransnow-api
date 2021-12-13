import { Module } from '@nestjs/common';
import { ApplicationController } from './Presentation/Controllers/application.controller';
import ApplicationAdapter from './Application/Adapters/application.adapter';
import ApplicationRepository from './Infrastructure/Repositories/application.repository';
import ApplicationService from './Domain/Services/application.service';
import { EdgeProvider } from '../../Core/View/edge.provider';

@Module({
  imports: [EdgeProvider],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    ApplicationAdapter,
    ApplicationRepository,
    {
      provide: 'ApplicationRepositoryInterface',
      useClass: ApplicationRepository,
    },
  ],
})
export class ApplicationModule {}
