import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Company} from "./company.entity";
import {LanguageTeamUser} from "./language-team-user.entity";
import {Application} from "./application.entity";
import { Language } from './language.entity';
import { Translation } from './translation.entity';
import { Exclude } from 'class-transformer';

@Entity('language_teams')
export class LanguageTeam {

    @Exclude()
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    name: string;

    @Column()
    alias: string;

    @Column({name: 'is_active'})
    isActive: boolean;

    @Exclude()
    @Column({name: 'deleted_at_unix'})
    deletedAt: number;

    @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;

    @UpdateDateColumn({name: 'updated_at',  precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: string;

    @ManyToOne(type => Company, company => company.languageTeams)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ManyToOne(type => Language, language => language.languageTeams)
    @JoinColumn({ name: 'language_id' })
    language: Language;

    @OneToMany(type => LanguageTeamUser, languageTeamUser => languageTeamUser.languageTeam)
    languageTeamUsers: LanguageTeamUser[];

    @ManyToMany(type => Application, application => application.languageTeams)
    applications: Application[];

    @OneToMany(type => Translation, translation => translation.languageTeam)
    translations: Translation[];
}
