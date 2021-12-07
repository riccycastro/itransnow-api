import { Module } from '@nestjs/common';
import { ApplicationController } from './Presentation/Controllers/application.controller';

@Module({
  imports: [],
  controllers: [ApplicationController],
  providers: [],
})
export class ApplicationModule {}
