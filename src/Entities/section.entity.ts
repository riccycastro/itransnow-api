import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn, RelationId,
    UpdateDateColumn,
} from 'typeorm';
import {Application} from './application.entity';
import {TranslationKey} from './translation-key.entity';
import { Exclude } from 'class-transformer';

@Entity('sections')
export class Section {

    @Exclude()
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    name: string;

    @Column()
    alias: string;

    @Column({name: 'is_active'})
    isActive: boolean;

    @Exclude()
    @Column({name: 'is_deleted'})
    isDeleted: boolean;

    @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;

    @UpdateDateColumn({name: 'updated_at',  precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: string;

    @ManyToOne(type => Application, application => application.sections)
    @JoinColumn({ name: "application_id" })
    application: Application;

    @ManyToMany(type => TranslationKey, translationKey => translationKey.sections)
    @JoinTable({name: 'section_translation_key', inverseJoinColumn: {name: 'translation_key_id'}, joinColumn: {name: 'section_id'}})
    translationKeys: TranslationKey[];

    @Exclude()
    @RelationId((section: Section) => section.application)
    applicationId: number;
}
