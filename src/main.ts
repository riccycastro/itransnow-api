import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import edge from 'edge.js';
import { initGlobals } from './Core/View/view.globals';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  let prodPath = '';
  if (process.env.NODE_ENV !== 'dev') {
    prodPath = '/dist';
  }

  edge.mount(`${process.env.INIT_CWD}${prodPath}/views`);
  initGlobals();

  app.use(cookieParser());
  await app.listen(process.env.PORT);
}

bootstrap();
