import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LanguageToApplicationDto {
  @ApiProperty()
  @IsNotEmpty()
  languagesCode: string[];
}
