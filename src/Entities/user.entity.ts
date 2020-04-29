import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { LanguageTeamUser } from './language-team-user.entity';
import { Comment } from './comment.entity';
import { Translation } from './translation.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ length: 100 })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'deleted_at_unix' })
  deletedAt: number;

  @Column({ name: 'is_visible' })
  isVisible: boolean;

  @Column({ name: 'is_admin' })
  isAdmin: boolean;

  @CreateDateColumn({
    name: 'created_at',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;

  @ManyToOne(type => Company, company => company.users)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Exclude()
  @RelationId((user: User) => user.company)
  companyId: number;

  @OneToMany(
    type => LanguageTeamUser,
    languageTeamUser => languageTeamUser.user,
  )
  languageTeamUsers: LanguageTeamUser[];

  @OneToMany(type => Comment, comment => comment.commentedBy)
  comments: Comment[];

  @OneToMany(type => Translation, translation => translation.acceptedBy)
  acceptedTranslations: Translation[];

  @OneToMany(type => Translation, translation => translation.createdBy)
  createdTranslations: Translation[];
}
