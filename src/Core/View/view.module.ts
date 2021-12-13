import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EdgeProvider } from './edge.provider';
import { EdgeMiddleware } from './edge.middleware';

@Global()
@Module({
  providers: [EdgeProvider],
  exports: [EdgeProvider],
})
export class ViewModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(EdgeMiddleware).forRoutes('*');
  }
}
