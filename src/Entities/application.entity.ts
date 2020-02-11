import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Section} from './section.entity';
import { Company } from './company.entity';
import {Language} from "./language.entity";
import {LanguageTeam} from "./language-team.entity";

@Entity('applications')
export class Application {
    private _id: number;
    private _name: string;
    private _isActive: boolean;
    private _isDeleted: boolean;
    private _createdAt: string;
    private _updatedAt: string;
    private _sections: Section[];
    private _company: Company;
    private _languages: Language[];
    private _languageTeams: LanguageTeam[];

    @PrimaryGeneratedColumn({type: 'bigint'})
    get id(): number { return this._id; }
    set id(id: number) { this._id = id; }

    @Column()
    get name(): string { return this._name; }
    set name(name: string) { this._name = name; }

    @Column({name: 'is_active'})
    get isActive(): boolean { return this._isActive; }
    set isActive(isActive: boolean) { this._isActive = isActive; }

    @Column({name: 'is_deleted'})
    get isDeleted(): boolean { return this._isDeleted; }
    set isDeleted(isDeleted: boolean) { this._isDeleted = isDeleted; }

    @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP'})
    get createdAt(): string { return this._createdAt; }
    set createdAt(createdAt: string) { this._createdAt = createdAt; }

    @UpdateDateColumn({name: 'updated_at', precision: 0, default: () => 'CURRENT_TIMESTAMP'})
    get updatedAt(): string { return this._updatedAt; }
    set updatedAt(updatedAt: string) { this._updatedAt = updatedAt; }

    @OneToMany(type => Section, section => section.application)
    get sections(): Section[] { return this._sections; }
    set sections(sections: Section[]) { this._sections = sections; }

    @ManyToOne(type => Company, company => company.applications)
    @JoinColumn({ name : "company_id" })
    get company(): Company { return this._company; }
    set company(company: Company) { this._company = company; }

    @ManyToMany(type => Language, language => language.applications)
    @JoinTable({name: 'application_languages', inverseJoinColumn: {name: 'language_id'}, joinColumn: {name: 'application_id'}})
    get languages(): Language[] { return this._languages; }
    set languages(languages: Language[]) { this._languages = languages; }

    addLanguage(language: Language) {
        if (!Array.isArray(this._languages)) {
            this._languages = [];
        }
        this._languages.push(language);
    }

    @ManyToMany(type => LanguageTeam, languageTeam => languageTeam.applications)
    @JoinTable({name: 'application_language_teams', inverseJoinColumn: {name: 'language_team_id'}, joinColumn: {name: 'application_id'}})
    get languageTeams(): LanguageTeam[] { return this._languageTeams; }
    set languageTeams(languageTeam: LanguageTeam[]) { this._languageTeams = languageTeam; }
}
