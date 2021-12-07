import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { engine } from '../lib/express-edge';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  let prodPath = '';
  if (process.env.NODE_ENV !== 'dev') {
    prodPath = '/dist';
  }

  app.use(engine);
  app.set('views', `${process.env.INIT_CWD}${prodPath}/views`);

  app.use(cookieParser());
  await app.listen(process.env.PORT);
}

bootstrap();
