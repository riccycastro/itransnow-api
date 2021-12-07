import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else {
      status = exception.status;
    }

    console.log(exception);

    if (exception instanceof UnauthorizedException) {
      response.redirect('/auth/login');
    } else if (status >= 500 && status < 600) {
      response.render('exception/5xx');
    } else if (status >= 400 && status < 500) {
      response.render('exception/4xx');
    } else {
      response.json(exception);
    }
  }
}
