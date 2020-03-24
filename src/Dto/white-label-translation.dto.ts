import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WhiteLabelTranslationDto {
  /**
   * language code
   */
  @ApiProperty()
  @IsDefined({ groups: ['post', 'patch'] })
  @IsString()
  @IsNotEmpty()
  language: string;

  /**
   * translation key alias
   */
  @ApiProperty()
  @IsDefined({ groups: ['post', 'patch'] })
  @IsString()
  @IsNotEmpty()
  translationKey: string;

  /**
   * translation text for given language
   */
  @ApiProperty()
  @IsDefined({ groups: ['post', 'patch'] })
  @IsString()
  @IsNotEmpty()
  translation: string;

  /**
   * language team alias
   */
  @ApiProperty()
  @IsOptional({ groups: ['post', 'patch'] })
  @IsString()
  @IsNotEmpty()
  languageTeam: string;
}
