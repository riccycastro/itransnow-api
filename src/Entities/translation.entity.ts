import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {TranslationKey} from './translation-key.entity';
import { Language } from './language.entity';
import { Comment } from './comment.entity';
import { User } from './user.entity';
import { TranslationStatus } from './translation-status.entity';

@Entity('translations')
export class Translation {
    private _id: number;
    private _translation: string;
    private _isDeleted: boolean;
    private _createdAt: string;
    private _updatedAt: string;
    private _translationKey: TranslationKey;
    private _language: Language;
    private _comments: Comment[];
    private _acceptedBy: User;
    private _createdBy: User;
    private _translationStatus: TranslationStatus;

    @PrimaryGeneratedColumn({type: 'bigint'})
    get id(): number { return this._id; }
    set id(id: number) { this._id = id; }

    @Column('longtext')
    get translation(): string { return this._translation; }
    set translation(translation: string) { this._translation = translation; }

    @Column({name: 'is_deleted'})
    get isDeleted(): boolean { return this._isDeleted; }
    set isDeleted(isDeleted: boolean) { this._isDeleted = isDeleted; }

    @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    get createdAt(): string { return this._createdAt; }
    set createdAt(createdAt: string) { this._createdAt = createdAt; }

    @UpdateDateColumn({name: 'updated_at',  precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    get updatedAt(): string { return this._updatedAt; }
    set updatedAt(updatedAt: string) { this._updatedAt = updatedAt; }

    @ManyToOne(type => TranslationKey, translationKey => translationKey.translations)
    get translationKey(): TranslationKey { return this._translationKey; }
    set TranslationKey(translationKey: TranslationKey) { this._translationKey = translationKey; }

    @ManyToOne(type => Language, language => language.translations)
    get language(): Language { return this._language; }
    set language(language: Language) { this._language = language; }

    @OneToMany(type => Comment, comment => comment.translation)
    get comments(): Comment[] { return this._comments }
    set comments(comments: Comment[]) { this._comments = comments; }

    @OneToMany(type => User, user => user.acceptedTranslations)
    @JoinColumn({ name: "accepted_by" })
    get acceptedBy(): User { return this._acceptedBy }
    set acceptedBy(acceptedBy: User) { this._acceptedBy = acceptedBy; }

    @OneToMany(type => User, user => user.createdTranslations)
    @JoinColumn({ name: "created_by" })
    get createdBy(): User { return this._createdBy }
    set createdBy(createdBy: User) { this._createdBy = createdBy; }

    @OneToMany(type => TranslationStatus, translationStatus => translationStatus.translations)
    get translationStatus(): TranslationStatus { return this._translationStatus }
    set translationStatus(translationStatus: TranslationStatus) { this._translationStatus = translationStatus; }
}
