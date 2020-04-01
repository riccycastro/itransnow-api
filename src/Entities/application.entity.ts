import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn, RelationId,
    UpdateDateColumn,
} from 'typeorm';
import {Section} from './section.entity';
import { Company } from './company.entity';
import {Language} from "./language.entity";
import {LanguageTeam} from "./language-team.entity";
import { TranslationKey } from './translation-key.entity';
import { Exclude } from 'class-transformer';
import { WhiteLabel } from './white-label.entity';

@Entity('applications')
export class Application {
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

    @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;

    @UpdateDateColumn({name: 'updated_at', precision: 0, default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: string;

    @OneToMany(type => Section, section => section.application)
    sections: Section[];

    @ManyToOne(type => Company, company => company.applications)
    @JoinColumn({ name : "company_id" })
    company: Company | number;

    @Exclude()
    @RelationId((application: Application) => application.company)
    companyId: number;

    @ManyToMany(type => Language, language => language.applications)
    @JoinTable({name: 'application_languages', inverseJoinColumn: {name: 'language_id'}, joinColumn: {name: 'application_id'}})
    languages: Language[];

    @Exclude()
    @RelationId((application: Application) => application.languages)
    languagesId: number[];

    @ManyToMany(type => LanguageTeam, languageTeam => languageTeam.applications)
    @JoinTable({name: 'application_language_teams', inverseJoinColumn: {name: 'language_team_id'}, joinColumn: {name: 'application_id'}})
    languageTeams: LanguageTeam[];

    @OneToMany(type => TranslationKey, translationKey => translationKey.application)
    translationKeys: TranslationKey[];

    @OneToMany(type => WhiteLabel, whiteLabel => whiteLabel.application)
    whiteLabels: WhiteLabel[];
}
