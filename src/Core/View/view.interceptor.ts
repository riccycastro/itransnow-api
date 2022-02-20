import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoutesDefinition } from './routes-definition';

@Injectable({ scope: Scope.REQUEST })
export class ViewInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const shareData: any = {
      user: req.user,
    };

    const edgeNotification = req.flash('edge');

    if (edgeNotification.length) {
      Object.assign(shareData, edgeNotification[0]);
    }
    try {
      shareData.page = RoutesDefinition.routeByUrl(req.url);
    } catch (err) {
      console.log(err);
    }
    res.share(shareData);

    return next.handle();
  }
}
