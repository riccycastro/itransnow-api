import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslationKeyToSectionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  translationKeys: string[];
}
