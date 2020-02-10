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

@Entity('languages')
export class Language {
    private _id: number;
    private _name: string;
    private _code: string;
    private _isActive: boolean;
    private _isDeleted: boolean;
    private _createdAt: string;
    private _updatedAt: string;
    private _translations: Translation[];
    private _applications: Application[];

    @PrimaryGeneratedColumn({type: 'bigint'})
    get id(): number { return this._id; }
    set id(id: number) { this._id = id; }

    @Column()
    get name(): string { return this._name; }
    set name(name: string) { this._name = name; }

    @Column()
    get code(): string { return this._code; }
    set code(code: string) { this._code = code; }

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

    @OneToMany(type => Translation, translation => translation.language)
    get translations(): Translation[] { return this._translations; }
    set translations(translations: Translation[]) { this._translations = translations; }

    @ManyToMany(type => Application, application => application.languages)
    get applications(): Application[] { return this._applications; }
    set applications(applications: Application[]) { this._applications = applications; }
}
