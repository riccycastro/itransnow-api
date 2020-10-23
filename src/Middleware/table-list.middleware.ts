import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class TableListMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function): void {

    req.query.offset = req.query.offset || 0;
    req.query.limit = this.validateMaxLimit(req.query.limit);
    req.query.orderField = req.query.orderField || '';
    req.query.orderDirection = req.query.orderDirection || 'ASC';
    req.query.includes = req.query.includes
      ? req.query.includes.split(',')
      : [];

    next();
  }

  private validateMaxLimit(limit?: string): number {
    const limitNumeric = Number(limit);
    if (!limit || isNaN(limitNumeric)) {
      return 10;
    }

    if (limitNumeric > 100) {
      return 100;
    }

    return limitNumeric;
  }
}
