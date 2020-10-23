import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SectionDto {
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

  @ApiProperty()
  @IsOptional({ groups: ['patch', 'Post'] })
  @IsBoolean()
  isActive: boolean;
}
