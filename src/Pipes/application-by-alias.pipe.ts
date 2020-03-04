import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { Application } from '../Entities/application.entity';

@Injectable()
export class ApplicationByAliasPipe implements PipeTransform {

  transform(value: string, metadata: ArgumentMetadata): Application {

    return undefined;
  }

}
