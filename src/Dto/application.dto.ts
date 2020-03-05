import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApplicationDto {
  @IsDefined({ groups: ['post', 'patch'] })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined({ groups: ['post'] })
  @IsOptional({groups: ['patch']})
  @IsNotEmpty()
  @IsString()
  alias: string;
}

export class ActiveApplicationDto {
  @IsDefined({groups: ['patch']})
  isActive: boolean;
}
