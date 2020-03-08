import {IsDefined, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Application} from "../Entities/application.entity";
import {Language} from "../Entities/language.entity";

export class TranslationDto {
    /**
     * language code
     */
    @IsDefined({groups: ['post', 'patch']})
    @IsString()
    @IsNotEmpty()
    language: string;

    /**
     * translation key alias
     */
    @IsDefined({groups: ['post']})
    @IsOptional({groups: ['patch']})
    @IsString()
    @IsNotEmpty()
    translationKey: string;

    /**
     * translation text for given language
     */
    @IsDefined({ groups: ['post'] })
    @IsOptional({groups: ['patch']})
    @IsString()
    @IsNotEmpty()
    translation: string;

    /**
     * application alias
     */
    @IsDefined({ groups: ['post', 'patch'] })
    @IsString()
    @IsNotEmpty()
    application: string;

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
}

export class TranslationNodeDto {
    application: Application;
    language: Language;
    translationKeys: string[];
    sections: string[];
}
