import { AbstractConverter } from './AbstractConverter';
import { GetApplicationsDto } from '../../Dto/GetApplicationsDto';
import { Application } from '../../Entities/application.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetApplicationsConverter extends AbstractConverter{
  convertToDto(entity: Application): GetApplicationsDto {
    const getApplicationsDto = new GetApplicationsDto();

    getApplicationsDto.id = entity.id;
    getApplicationsDto.name = entity.name;
    getApplicationsDto.alias = entity.alias;
    getApplicationsDto.isActive = entity.isActive;
    getApplicationsDto.createdAt = entity.createdAt;
    getApplicationsDto.updatedAt = entity.updatedAt;

    return getApplicationsDto;
  }
}