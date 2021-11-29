import {ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        console.log('error', status)

        if (exception instanceof UnauthorizedException) {
            response.redirect('/auth/login')
        } else if (status >= 500 && status < 600) {

        } else if (status >= 400 && status < 500) {
            response.render('exception/404')
        }
    }
}
