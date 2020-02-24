import { Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationService } from '../Services/application.service';

@Injectable()
export class ApplicationByAliasMiddleware implements NestMiddleware {

  constructor(private readonly applicationService: ApplicationService){ }

  use(req: Request, res: Response, next: () => void): any {
    if (!req.params.alias) {
      throw new InternalServerErrorException("no alias provided")
    }

    //applicationService
  }

}