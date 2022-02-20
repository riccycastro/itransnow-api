import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as flash from 'connect-flash';
import edge from 'edge.js';
import { initGlobals } from './Core/View/view.globals';
import { engine } from './Core/View';

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
  app.use(flash());
  app.use(engine);

  await app.listen(process.env.PORT);
}

bootstrap();
