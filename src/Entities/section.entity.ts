import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Application} from './application.entity';
import {TranslationKey} from './translation-key.entity';

@Entity('sections')
export class Section {
    private _id: number;
    private _name: string;
    private _alias: string;
    private _isActive: boolean;
    private _isDeleted: boolean;
    private _createdAt: string;
    private _updatedAt: string;
    private _application: Application;
    private _translationKeys: TranslationKey[];

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

    @ManyToOne(type => Application, application => application.sections)
    @JoinColumn({ name: "application_id" })
    get application(): Application { return this._application; }
    set application(application: Application) { this._application = application; }

    @ManyToMany(type => TranslationKey, translationKey => translationKey.sections)
    @JoinTable({name: 'section_translation_key', inverseJoinColumn: {name: 'translation_key_id'}, joinColumn: {name: 'section_id'}})
    get translationKeys(): TranslationKey[] { return this._translationKeys; }
    set translationKeys(translationKeys: TranslationKey[]) { this._translationKeys = translationKeys; }
}
