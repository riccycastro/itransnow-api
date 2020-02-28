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
import { LanguageTeam } from './language-team.entity';

@Entity('translations')
export class Translation {

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column('longtext')
    translation: string;

    @Column({name: 'is_deleted'})
    isDeleted: boolean;

    @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;

    @UpdateDateColumn({name: 'updated_at',  precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: string;

    @ManyToOne(type => TranslationKey, translationKey => translationKey.translations)
    @JoinColumn({ name: 'translation_key_id' })
    translationKey: TranslationKey;

    @ManyToOne(type => Language, language => language.translations)
    @JoinColumn({ name: 'language_id' })
    language: Language;

    @OneToMany(type => Comment, comment => comment.translation)
    comments: Comment[];

    @ManyToOne(type => User, user => user.acceptedTranslations)
    @JoinColumn({ name: "accepted_by" })
    acceptedBy: User;

    @ManyToOne(type => User, user => user.createdTranslations)
    @JoinColumn({ name: "created_by" })
    createdBy: User;

    @ManyToOne(type => TranslationStatus, translationStatus => translationStatus.translations)
    @JoinColumn({ name: 'translation_status_id' })
    translationStatus: TranslationStatus;

    @ManyToOne(type => LanguageTeam, languageTeam => languageTeam.translations)
    @JoinColumn({ name: 'language_team_id' })
    languageTeam: LanguageTeam;
}
