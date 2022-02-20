import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  private _id: number;

  private _name: string;

  private _username: string;

  private _email: string;

  private _password: string;

  private _isActive: boolean;

  private _deletedAt: number;

  private _isAdmin: boolean;
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

  @Column({ length: 100 })
  get username(): string {
    return this._username;
  }

  set username(username: string) {
    this._username = username;
  }

  @Column()
  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
  }

  @Exclude()
  @Column()
  get password(): string {
    return this._password;
  }

  set password(password: string) {
    this._password = password;
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

  @Column({ name: 'is_admin' })
  get isAdmin(): boolean {
    return this._isAdmin;
  }

  set isAdmin(isAdmin: boolean) {
    this._isAdmin = isAdmin;
  }
}
