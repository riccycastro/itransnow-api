import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WhiteLabelDto {
  @IsDefined({ groups: ['post', 'patch'] })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined({ groups: ['post'] })
  @IsOptional({groups: ['patch']})
  @IsString()
  @IsNotEmpty()
  alias: string;
}
