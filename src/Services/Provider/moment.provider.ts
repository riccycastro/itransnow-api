import { Injectable } from '@nestjs/common';
import { Moment, MomentFormatSpecification, MomentInput, utc as MomentUtc } from 'moment';

@Injectable()
export class MomentProvider {
  utc(inp?: MomentInput, format?: MomentFormatSpecification, language?: string, strict?: boolean): Moment {
    return MomentUtc(inp, format, language, strict);
  }
}
