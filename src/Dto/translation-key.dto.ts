import { IsNotEmpty } from 'class-validator';

export class AddTranslationKeyToSectionDto {
  @IsNotEmpty()
  translationKeys: string[];
}
