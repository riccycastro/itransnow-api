import { IsNotEmpty } from 'class-validator';

export class TranslationKeyToSectionDto {
  @IsNotEmpty()
  translationKeys: string[];
}
