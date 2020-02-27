import { IsNotEmpty } from 'class-validator';

export class AddLanguageToApplicationDto {
  @IsNotEmpty()
  languagesCode: string[];
}
