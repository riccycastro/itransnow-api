import {IsDefined, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class TranslationDto {
    /**
     * language code
     */
    @IsDefined({ groups: ['post', 'patch'] })
    @IsString()
    @IsNotEmpty()
    language: string;

    /**
     * translation key alias
     */
    @IsDefined({ groups: ['post', 'patch'] })
    @IsString()
    @IsNotEmpty()
    translationKey: string;

    /**
     * translation text for given language
     */
    @IsDefined({ groups: ['post', 'patch'] })
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
}
