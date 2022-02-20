import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export default class User {
  private _id: number;

  @Exclude()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  private _name: string;

  @Column()
  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  private _username: string;

  @Column({ length: 100 })
  get username(): string {
    return this._username;
  }

  set username(username: string) {
    this._username = username;
  }

  private _email: string;

  @Column()
  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
  }

  private _password: string;

  @Exclude()
  @Column()
  get password(): string {
    return this._password;
  }

  set password(password: string) {
    this._password = password;
  }

  private _isActive: boolean;

  @Column({ name: 'is_active' })
  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  private _deletedAt: number;

  @Exclude()
  @Column({ name: 'deleted_at_unix' })
  get deletedAt(): number {
    return this._deletedAt;
  }

  set deletedAt(deletedAt: number) {
    this._deletedAt = deletedAt;
  }

  private _isVisible: boolean;

  @Exclude()
  @Column({ name: 'is_visible' })
  get isVisible(): boolean {
    return this._isVisible;
  }

  set isVisible(isVisible: boolean) {
    this._isVisible = isVisible;
  }

  private _isAdmin: boolean;

  @Column({ name: 'is_admin' })
  get isAdmin(): boolean {
    return this._isAdmin;
  }

  set isAdmin(isAdmin: boolean) {
    this._isAdmin = isAdmin;
  }

  private _createdAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  private _updatedAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }

  private _createdBy: User;

  @ManyToOne((type) => User, (user) => user.createdUsers)
  @JoinColumn({ name: 'created_by' })
  get createdBy(): User {
    return this._createdBy;
  }

  set createdBy(user: User) {
    this._createdBy = user;
  }

  private _createdUsers: User[];

  @OneToMany((type) => User, (user) => user.createdBy)
  get createdUsers(): User[] {
    return this._createdUsers;
  }

  set createdUsers(createdUsers: User[]) {
    this._createdUsers = createdUsers;
  }
}
