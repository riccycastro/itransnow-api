import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WhiteLabelDto {
  @ApiProperty()
  @IsDefined({ groups: ['post', 'patch'] })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDefined({ groups: ['post'] })
  @IsOptional({ groups: ['patch'] })
  @IsString()
  @IsNotEmpty()
  alias: string;
}

export class ActiveWhiteLabelDto {
  @ApiProperty()
  @IsDefined({ groups: ['patch'] })
  isActive: boolean;
}
