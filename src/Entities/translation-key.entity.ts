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

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    alias: string;

    @Column({name: 'is_active'})
    isActive: boolean;

    @Column({name: 'is_deleted'})
    isDeleted: boolean;

    @CreateDateColumn({name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;

    @UpdateDateColumn({name: 'updated_at',  precision: 0, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: string;

    @ManyToMany(type => Section, section => section.translationKeys)
    sections: Section[];

    @OneToMany(type => Translation, translation => translation.translationKey)
    translations: Translation[];

    @ManyToOne(type => Application, application => application.translationKeys)
    @JoinColumn({ name: "application_id" })
    application: Application;
}
