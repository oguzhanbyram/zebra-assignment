import { Global, MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';

import { REQUEST_CONTEXT_SERVICE } from './request-context.constants';
import { RequestContextMiddleware } from './request-context.middleware';
import { RequestContextServiceImpl } from './request-context.service.impl';

@Global()
@Module({
  providers: [
    {
      provide: REQUEST_CONTEXT_SERVICE,
      useClass: RequestContextServiceImpl,
      scope: Scope.REQUEST,
    },
  ],
  exports: [REQUEST_CONTEXT_SERVICE],
})
export class RequestContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
