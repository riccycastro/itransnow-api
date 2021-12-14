import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EdgeProvider } from './edge.provider';
import { RoutesDefinition } from './routes-definition';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ViewInterceptor implements NestInterceptor {
  constructor(private readonly edgeProvider: EdgeProvider) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    const shareData: any = {
      user: req.user,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const edgeNotification = req.session.edge;

    if (edgeNotification) {
      Object.assign(shareData, edgeNotification);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.session.edge = undefined;
    }
    try {
      shareData.page = RoutesDefinition.routeByUrl(req.url);
    } catch (err) {
      console.log(err);
    }
    this.edgeProvider.share(shareData);

    return next.handle();
  }
}
