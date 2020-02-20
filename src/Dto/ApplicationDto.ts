import { IsNotEmpty, IsString } from 'class-validator';

export class ApplicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  alias: string;
}

export class GetApplicationsDto {
  id: number;
  name: string;
  alias: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
