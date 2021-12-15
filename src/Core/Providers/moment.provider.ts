import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export default class MomentProvider {
  utc(
    inp?: moment.MomentInput,
    format?: moment.MomentFormatSpecification,
    language?: string,
    strict?: boolean,
  ): moment.Moment {
    return moment.utc(inp, format, language, strict);
  }

  unix(
    inp?: moment.MomentInput,
    format?: moment.MomentFormatSpecification,
    language?: string,
    strict?: boolean,
  ): number {
    return moment.utc(inp, format, language, strict).unix();
  }

  static dateToString(date?: Date): string {
    if (!date) {
      return '--';
    }
    return moment(date).format('Y-M-DD');
  }
}
