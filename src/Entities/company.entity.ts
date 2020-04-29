import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Application } from './application.entity';
import { User } from './user.entity';
import { LanguageTeam } from './language-team.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  alias: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'deleted_at_unix' })
  deletedAt: number;

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

  @OneToMany(type => Application, application => application.company)
  applications: Application[];

  @OneToMany(type => User, user => user.company)
  users: User[];

  @OneToMany(type => LanguageTeam, languageTeam => languageTeam.company)
  languageTeams: LanguageTeam[];
}
