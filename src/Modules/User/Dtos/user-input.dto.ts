import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export default class UserInputDto {
  @IsDefined({ groups: ['post', 'patch'] })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined({ groups: ['post'] })
  @IsOptional({ groups: ['patch'] })
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsDefined({ groups: ['post', 'patch'] })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined({ groups: ['patch', 'post'] })
  @IsString()
  isActive = 'OFF';

  @IsDefined({ groups: ['post'] })
  @IsString()
  password: string;

  @IsDefined({ groups: ['post'] })
  @IsString()
  confirmPassword: string;

  constructor(init?: Partial<UserInputDto>) {
    Object.assign(this, init);
  }
}
