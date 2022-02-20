import { ForbiddenException } from '@nestjs/common';

export class ApplicationAliasExistsException extends ForbiddenException {
  constructor(applicationAlias: string) {
    super({
      property: 'alias',
      message: `Application with alias "${applicationAlias}" already exists`,
      code: 'AlreadyExists',
    });
  }
}
