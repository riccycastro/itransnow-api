import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Section} from './section.entity';
import {Translation} from './translation.entity';
import { Application } from './application.entity';

@Entity('translation_keys')
export class TranslationKey {
    private _id: number;
    private _alias: string;
    private _isActive: boolean;
    private _isDeleted: boolean;
    private _createdAt: string;
    private _updatedAt: string;
    private _sections: Section[];
    private _translations: Translation[];
    private _application: Application;

    @PrimaryGeneratedColumn({type: 'bigint'})
    get id(): number { return this._id; }
    set id(id: number) { this._id = id; }

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

    @ManyToMany(type => Section, section => section.translationKeys)
    get sections(): Section[] { return this._sections; }
    set sections(sections: Section[]) { this._sections = sections; }

    @OneToMany(type => Translation, translation => translation.translationKey)
    get translations(): Translation[] { return this._translations; }
    set translations(translations: Translation[]) { this._translations = translations; }

    @ManyToOne(type => Application, application => application.translationKeys)
    @JoinColumn({ name: "application_id" })
    get application(): Application { return this._application; }
    set application(application: Application) { this._application = application; }
}
