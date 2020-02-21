import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Translation } from './translation.entity';
import {Application} from "./application.entity";
import { LanguageTeam } from './language-team.entity';
import { Exclude } from 'class-transformer';

@Entity('languages')
export class Language {

    @Exclude()
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column({name: 'is_active'})
    isActive: boolean;

    @Exclude()
    @Column({name: 'is_deleted'})
    isDeleted: boolean;

    @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;

    @UpdateDateColumn({name: 'updated_at',  precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: string;

    @OneToMany(type => Translation, translation => translation.language)
    translations: Translation[];

    @ManyToMany(type => Application, application => application.languages)
    applications: Application[];

    @OneToMany(type => LanguageTeam, languageTeam => languageTeam.language)
    languageTeams: LanguageTeam[];
}
