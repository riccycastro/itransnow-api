import {IsDefined, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Application} from "../Entities/application.entity";
import {Language} from "../Entities/language.entity";
import { WhiteLabel } from '../Entities/white-label.entity';

export class TranslationDto {
    /**
     * language code
     */
    @IsDefined({groups: ['post', 'patch']})
    @IsString()
    @IsNotEmpty()
    language: string;

    /**
     * application alias
     */
    @IsDefined({ groups: ['post', 'patch'] })
    @IsString()
    @IsNotEmpty()
    application: string;

    /**
     * translation key alias
     */
    @IsDefined({groups: ['post']})
    @IsOptional({groups: ['patch']})
    @IsString()
    @IsNotEmpty()
    translationKey: string;

    /**
     * translation key alias
     */
    @IsDefined({groups: ['post']})
    @IsOptional({groups: ['patch']})
    @IsString()
    @IsNotEmpty()
    section: string;

    /**
     * translation text for given language
     */
    @IsDefined({ groups: ['post'] })
    @IsOptional({groups: ['patch']})
    @IsString()
    @IsNotEmpty()
    translation: string;

    /**
     * language team alias
     */
    @IsOptional({ groups: ['post', 'patch'] })
    @IsString()
    @IsNotEmpty()
    languageTeam: string;

    @IsOptional({ groups: ['post', 'patch'] })
    @IsString()
    extension: string;

    @IsOptional({ groups: ['post', 'patch'] })
    @IsString()
    indexType: string;

    @IsOptional({ groups: ['post', 'patch'] })
    @IsString()
    whiteLabel: string;
}

export class TranslationNodeDto {
    application: Application;
    language: Language;
    whiteLabel: WhiteLabel;
    translationKeys: string[];
    sections: string[];
}
