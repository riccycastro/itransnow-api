import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {NestExpressApplication} from "@nestjs/platform-express";
import {config, engine} from 'express-edge';
import * as cookieParser from "cookie-parser";
import {HttpExceptionFilter} from "./Core/Filters/Exceptions/http-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    app.enableCors({origin: 'http://app.itransnow.local'});

    const options = new DocumentBuilder().addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    let prodPath = '';
    if (process.env.NODE_ENV !== 'dev') {
        prodPath = '/dist';
    }

    config({cache: process.env.NODE_ENV !== 'dev'});
    app.use(engine);
    app.set('views', `${process.env.INIT_CWD}${prodPath}/views`);

    app.use(cookieParser());
    app.useGlobalFilters(new HttpExceptionFilter())

    await app.listen(process.env.PORT);
}

bootstrap();
