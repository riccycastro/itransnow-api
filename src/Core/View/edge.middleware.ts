import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { EdgeProvider } from './edge.provider';

@Injectable()
export class EdgeMiddleware implements NestMiddleware {
  constructor(private readonly edgeProvider: EdgeProvider) {}

  async use(req: Request, res: Response, next: () => void): Promise<any> {
    const shareData = {};

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const edgeNotification = req.session.edge;

    if (edgeNotification) {
      Object.assign(shareData, edgeNotification);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.session.edge = undefined;
    }

    this.edgeProvider.share(shareData);
    next();
  }
}
