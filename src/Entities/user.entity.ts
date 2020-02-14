import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import {LanguageTeamUser} from "./language-team-user.entity";
import { Comment } from './comment.entity';
import { Translation } from './translation.entity';

@Entity('users')
export class User {
    private _id: number;
    private _name: string;
    private _username: string;
    private _email: string;
    private _password: string;
    private _isActive: boolean;
    private _isDeleted: boolean;
    private _isVisible: boolean;
    private _isAdmin: boolean;
    private _createdAt: string;
    private _updatedAt: string;
    private _company: Company;
    private _languageTeamUsers: LanguageTeamUser[];
    private _comments: Comment[];
    private _acceptedTranslations: Translation[];
    private _createdTranslations: Translation[];

    @PrimaryGeneratedColumn({type: 'bigint'})
    get id(): number { return this._id; }
    set id(id: number) { this._id = id; }

    @Column()
    get name(): string { return this._name; }
    set name(name: string) { this._name = name; }

    @Column({length: 100})
    get username(): string { return this._username; }
    set username(username: string) { this._username = username; }

    @Column()
    get email(): string { return this._email; }
    set email(email: string) { this._email = email; }

    @Column()
    get password(): string { return this._password; }
    set password(password: string) { this._password = password; }

    @Column({ name: 'is_active' })
    get isActive(): boolean { return this._isActive; }
    set isActive(isActive: boolean) { this._isActive = isActive; }

    @Column({ name: 'is_deleted' })
    get isDeleted(): boolean { return this._isDeleted; }
    set isDeleted(isDeleted: boolean) { this._isDeleted = isDeleted; }

    @Column({ name: 'is_visible' })
    get isVisible(): boolean { return this._isVisible; }
    set isVisible(isVisible: boolean) { this._isVisible = isVisible; }

    @Column({ name: 'is_admin' })
    get isAdmin(): boolean { return this._isAdmin; }
    set isAdmin(isAdmin: boolean) { this._isAdmin = isAdmin; }

    @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP'})
    get createdAt(): string { return this._createdAt; }
    set createdAt(createdAt: string) { this._createdAt = createdAt; }

    @UpdateDateColumn({name: 'updated_at', precision: 0, default: () => 'CURRENT_TIMESTAMP'})
    get updatedAt(): string { return this._updatedAt; }
    set updatedAt(updatedAt: string) { this._updatedAt = updatedAt; }

    @ManyToOne(type => Company, company => company.users)
    @JoinColumn({ name : "company_id" })
    get company(): Company { return this._company; }
    set company(company: Company) { this._company = company; }

    @OneToMany(type => LanguageTeamUser, languageTeamUser => languageTeamUser.user)
    get languageTeamUsers(): LanguageTeamUser[] { return this._languageTeamUsers }
    set languageTeamUsers(languageTeamUsers: LanguageTeamUser[]) { this._languageTeamUsers = languageTeamUsers; }

    @OneToMany(type => Comment, comment => comment.commentedBy)
    get comments(): Comment[] { return this._comments }
    set comments(comments: Comment[]) { this._comments = comments; }

    @OneToMany(type => Translation, translation => translation.acceptedBy)
    get acceptedTranslations(): Translation[] { return this._acceptedTranslations }
    set acceptedTranslations(acceptedTranslations: Translation[]) { this._acceptedTranslations = acceptedTranslations; }

    @OneToMany(type => Translation, translation => translation.createdBy)
    get createdTranslations(): Translation[] { return this._createdTranslations }
    set createdTranslations(createdTranslations: Translation[]) { this._createdTranslations = createdTranslations; }
}
