import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddLanguageToApplicationDto {
  @ApiProperty()
  @IsNotEmpty()
  languagesCode: string[];
}
