import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApplicationInputDto {
  @IsDefined({ groups: ['post', 'patch'] })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined({ groups: ['post'] })
  @IsOptional({ groups: ['patch'] })
  @IsNotEmpty()
  @IsString()
  alias: string;

  @IsDefined({ groups: ['patch', 'post'] })
  @IsString()
  isActive: string = 'OFF';

  constructor(init?: Partial<ApplicationInputDto>) {
    Object.assign(this, init);
  }
}
