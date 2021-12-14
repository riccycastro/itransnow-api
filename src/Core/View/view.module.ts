import { Global, Module } from '@nestjs/common';
import { EdgeProvider } from './edge.provider';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ViewInterceptor } from './view.interceptor';

@Global()
@Module({
  providers: [
    EdgeProvider,
    {
      provide: APP_INTERCEPTOR,
      useClass: ViewInterceptor,
    },
  ],
  exports: [EdgeProvider],
})
export class ViewModule {}
