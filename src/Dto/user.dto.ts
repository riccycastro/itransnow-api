import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsDefined({ groups: ['post', 'patch'] })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ActiveUserDto {
  @ApiProperty()
  @IsDefined({ groups: ['patch'] })
  isActive: boolean;
}

export class AdminUserDto {
  @ApiProperty()
  @IsDefined({ groups: ['patch'] })
  isAdmin: boolean;
}
