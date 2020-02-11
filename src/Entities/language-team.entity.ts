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

@Entity('language_teams')
export class LanguageTeam {
    private _id: number;
    private _name: string;
    private _alias: string;
    private _isActive: boolean;
    private _isDeleted: boolean;
    private _createdAt: string;
    private _updatedAt: string;
    private _company: Company;
    private _language: Language;
    private _languageTeamUsers: LanguageTeamUser[];
    private _applications: Application[];
    private _translations: Translation[];

    @PrimaryGeneratedColumn({type: 'bigint'})
    get id(): number { return this._id; }
    set id(id: number) { this._id = id; }

    @Column()
    get name(): string { return this._name; }
    set name(name: string) { this._name = name; }

    @Column()
    get alias(): string { return this._alias; }
    set alias(alias: string) { this._alias = alias; }

    @Column({name: 'is_active'})
    get isActive(): boolean { return this._isActive; }
    set isActive(isActive: boolean) { this._isActive = isActive; }

    @Column({name: 'is_deleted'})
    get isDeleted(): boolean { return this._isDeleted; }
    set isDeleted(isDeleted: boolean) { this._isDeleted = isDeleted; }

    @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    get createdAt(): string { return this._createdAt; }
    set createdAt(createdAt: string) { this._createdAt = createdAt; }

    @UpdateDateColumn({name: 'updated_at',  precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    get updatedAt(): string { return this._updatedAt; }
    set updatedAt(updatedAt: string) { this._updatedAt = updatedAt; }

    @ManyToOne(type => Company, company => company.languageTeams)
    @JoinColumn({ name: 'company_id' })
    get company(): Company { return this._company; }
    set company(company: Company) { this._company = company; }

    @OneToMany(type => LanguageTeamUser, languageTeamUser => languageTeamUser.languageTeam)
    get languageTeamUsers(): LanguageTeamUser[] { return this._languageTeamUsers; }
    set languageTeamUsers(languageTeamUsers: LanguageTeamUser[]) { this._languageTeamUsers = languageTeamUsers; }

    @ManyToMany(type => Application, application => application.languageTeams)
    get applications(): Application[] { return this._applications; }
    set applications(applications: Application[]) { this._applications = applications; }

    @ManyToOne(type => Language, language => language.languageTeams)
    @JoinColumn({ name: 'language_id' })
    get language(): Language { return this._language; }
    set language(language: Language) { this._language = language; }

    @OneToMany(type => Translation, translation => translation.languageTeam)
    get translations(): Translation[] { return this._translations; }
    set translations(translations: Translation[]) { this._translations = translations }
}
