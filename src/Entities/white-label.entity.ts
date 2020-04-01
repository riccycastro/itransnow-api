import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, ManyToOne, OneToMany,
  PrimaryGeneratedColumn, RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Application } from './application.entity';
import { WhiteLabelTranslation } from './white-label-translation.entity';

@Entity('white_labels')
export class WhiteLabel {

  @Exclude()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  alias: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Exclude()
  @Column({name: 'deleted_at_unix'})
  deletedAt: number;

  @CreateDateColumn({ name: 'created_at', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string;

  @ManyToOne(type => Application, application => application.whiteLabels)
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Exclude()
  @RelationId((whiteLabel: WhiteLabel) => whiteLabel.application)
  applicationId: number;

  @OneToMany(type => WhiteLabelTranslation, whiteLabelTranslation => whiteLabelTranslation.whiteLabel)
  whiteLabelTranslations: WhiteLabelTranslation[];
}
