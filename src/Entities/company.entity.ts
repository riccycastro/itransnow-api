import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Application } from './application.entity';
import { User } from './user.entity';
import {LanguageTeam} from "./language-team.entity";

@Entity('companies')
export class Company {
  private _id: number;
  private _name: string;
  private _alias: string;
  private _isActive: boolean;
  private _isDeleted: boolean;
  private _createdAt: string;
  private _updatedAt: string;
  private _applications: Application[];
  private _users: User[];
  private _languageTeams: LanguageTeam[];

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

  @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP'})
  get createdAt(): string { return this._createdAt; }
  set createdAt(createdAt: string) { this._createdAt = createdAt; }

  @UpdateDateColumn({name: 'updated_at', precision: 0, default: () => 'CURRENT_TIMESTAMP'})
  get updatedAt(): string { return this._updatedAt; }
  set updatedAt(updatedAt: string) { this._updatedAt = updatedAt; }

  @OneToMany(type => Application, application => application.company)
  get applications(): Application[] { return this._applications; }
  set applications(applications: Application[]) { this._applications = applications; }

  @OneToMany(type => User, user => user.company)
  get users(): User[] { return this._users; }
  set users(users: User[]) { this._users = users; }

  @OneToMany(type => LanguageTeam, languageTeam => languageTeam.company)
  get languageTeams(): LanguageTeam[] { return this._languageTeams; }
  set languageTeams(languageTeams: LanguageTeam[]) { this._languageTeams = languageTeams; }
}
