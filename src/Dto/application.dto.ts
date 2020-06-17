import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @ApiProperty()
  @IsOptional({ groups: ['patch', 'post'] })
  @IsBoolean()
  isActive: boolean;
}

export class ActiveApplicationDto {
  @ApiProperty()
  @IsDefined({ groups: ['patch'] })
  @IsBoolean()
  isActive: boolean;
}
