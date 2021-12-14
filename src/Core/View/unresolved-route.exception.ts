import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

export class UnresolvedRouteException extends RuntimeException {
  constructor(routeName: string) {
    super(`Unresolved route for: ${routeName}`);
  }
}
