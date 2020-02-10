import { User } from './user.entity';
import { Translation } from './translation.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  private _id: number;
  private _comment: string;
  private _submittedAt: string;
  private _commentedBy: User;
  private _translation: Translation;

  @PrimaryGeneratedColumn({type: 'bigint'})
  get id(): number { return this._id; }
  set id(id: number) { this._id = id; }

  @Column()
  get name(): string { return this._comment; }
  set name(comment: string) { this._comment = comment; }

  @Column({name: 'submitted_at'})
  get submittedAt(): string { return this._submittedAt; }
  set submittedAt(submittedAt: string) { this._submittedAt = submittedAt; }

  @ManyToOne(type => Translation, translation => translation.comments)
  get translation(): Translation { return this._translation; }
  set translation(translation: Translation) { this._translation = translation; }

  @ManyToOne(type => User, user => user.comments)
  @JoinColumn({ name: "commented_by" })
  get commentedBy(): User { return this._commentedBy; }
  set commentedBy(commentedBy: User) { this._commentedBy = commentedBy; }
}
