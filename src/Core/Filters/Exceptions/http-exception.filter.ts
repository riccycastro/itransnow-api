import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import edge from 'edge.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost): Promise<any> {
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
      return await edge.render('exception/5xx');
    } else if (status >= 400 && status < 500) {
      return await edge.render('exception/4xx');
    } else {
      response.json(exception);
    }
  }
}