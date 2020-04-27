import { IsArray, IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Application } from '../Entities/application.entity';
import { Language } from '../Entities/language.entity';
import { WhiteLabel } from '../Entities/white-label.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TranslationDto {
    /**
     * language code
     */
    @ApiProperty()
    @IsDefined({ groups: ['post', 'patch'] })
    @IsString()
    @IsNotEmpty()
    language: string;

    /**
     * application alias
     */
    @ApiProperty()
    @IsDefined({ groups: ['post', 'patch'] })
    @IsString()
    @IsNotEmpty()
    application: string;

    /**
     * translation key alias
     */
    @ApiProperty()
    @IsDefined({ groups: ['post'] })
    @IsOptional({groups: ['patch']})
    @IsString()
    @IsNotEmpty()
    translationKey: string;

    /**
     * translation key alias
     */
    @ApiProperty()
    @IsDefined({ groups: ['post'] })
    @IsOptional({groups: ['patch']})
    @IsString()
    @IsNotEmpty()
    section: string;

    /**
     * translation text for given language
     */
    @ApiProperty()
    @IsDefined({ groups: ['post'] })
    @IsOptional({groups: ['patch', 'get']})
    @IsString()
    @IsNotEmpty()
    translation: string;

    /**
     * language team alias
     */
    @ApiProperty()
    @IsOptional({ groups: ['post', 'patch'] })
    @IsString()
    @IsNotEmpty()
    languageTeam: string;

    @IsOptional({ groups: ['post', 'patch'] })
    @IsString()
    extension: string;

    @ApiProperty()
    @IsOptional({ groups: ['post', 'patch'] })
    @IsString()
    indexType: 'nested' | 'flat';

    @ApiProperty()
    @IsOptional({ groups: ['post', 'patch'] })
    @IsString()
    whiteLabel: string;

    @ApiProperty()
    @IsOptional({ groups: ['post', 'patch'] })
    @IsArray()
    includes: string[];
}

export class TranslationNodeDto {
    application: Application;
    language: Language;
    whiteLabel: WhiteLabel;
    translationKeys: string[];
    sections: string[];
}
