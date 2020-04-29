import { User } from './user.entity';
import { Translation } from './translation.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  comment: string;

  @Column({ name: 'submitted_at' })
  submittedAt: string;

  @ManyToOne(type => User, user => user.comments)
  @JoinColumn({ name: 'commented_by' })
  commentedBy: User;

  @ManyToOne(type => Translation, translation => translation.comments)
  translation: Translation;
}
