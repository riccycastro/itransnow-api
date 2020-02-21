import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class TableListMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function): void {
    req.query.offset = req.query.offset ?? 0;
    req.query.limit = req.query.limit ?? 10;
    req.query.search = req.query.search ?? {};
    req.query.orderField = req.query.orderDirection ?? '';
    req.query.orderDirection = req.query.orderDirection ?? 'ASC';
    req.query.includes = req.query.includes ? req.query.includes.split(',') : [];

    next();
  }
}
