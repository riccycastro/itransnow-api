import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('applications')
export class Application {
  private _id: number;

  private _name = '';

  private _alias = '';

  private _isActive = true;

  private _deletedAt: number;

  private _createdAt: string;

  private _updatedAt: string;

  @Exclude()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  @Column()
  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  @Column()
  get alias(): string {
    return this._alias;
  }

  set alias(alias: string) {
    this._alias = alias;
  }

  @Column({ name: 'is_active' })
  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  @Exclude()
  @Column({ name: 'deleted_at_unix' })
  get deletedAt(): number {
    return this._deletedAt;
  }

  set deletedAt(deletedAt: number) {
    this._deletedAt = deletedAt;
  }

  @CreateDateColumn({
    name: 'created_at',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(createdAt: string) {
    this._createdAt = createdAt;
  }

  @UpdateDateColumn({
    name: 'updated_at',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  get updatedAt(): string {
    return this._updatedAt;
  }

  set updatedAt(updatedAt: string) {
    this._updatedAt = updatedAt;
  }
}
