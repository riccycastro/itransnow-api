import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {User} from "./user.entity";
import {LanguageTeam} from "./language-team.entity";

@Entity('language_team_users')
export class LanguageTeamUser {
    private _id: number;
    private _isManager: boolean;
    private _languageTeam: LanguageTeam;
    private _user: User;

    @PrimaryGeneratedColumn({type: 'bigint'})
    get id(): number { return this._id; }
    set id(id: number) { this._id = id; }

    @Column({name: 'is_manager'})
    get isManager(): boolean { return this._isManager; }
    set isManager(isManager: boolean) { this._isManager = isManager; }

    @ManyToOne(type => User, user => user.languageTeamUsers)
    @JoinColumn({ name: 'user_id' })
    get user(): User { return this._user; }
    set user(user: User) { this._user = user; }

    @ManyToOne(type => LanguageTeam, languageTeam => languageTeam.languageTeamUsers)
    @JoinColumn({ name: 'language_team_id' })
    get languageTeam(): LanguageTeam { return this._languageTeam; }
    set languageTeam(languageTeam: LanguageTeam) { this._languageTeam = languageTeam; }
}
