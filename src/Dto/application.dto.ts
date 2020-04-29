import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplicationDto {
  @ApiProperty()
  @IsDefined({ groups: ['post', 'patch'] })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDefined({ groups: ['post'] })
  @IsOptional({ groups: ['patch'] })
  @IsNotEmpty()
  @IsString()
  alias: string;
}

export class ActiveApplicationDto {
  @ApiProperty()
  @IsDefined({ groups: ['patch'] })
  isActive: boolean;
}
