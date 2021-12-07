import { applyDecorators, Injectable, Scope } from '@nestjs/common';

export const Tenantable = () =>
  applyDecorators(Injectable({ scope: Scope.REQUEST }));
