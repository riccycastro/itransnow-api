import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['id'])
export class Tenant {
  private _id: number;

  private _name: string;

  private _code: string;

  private _isActive: boolean;

  private _deletedAt: number;

  set id(value: number) {
    this._id = value;
  }

  @Column({ name: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  get id(): number {
    return this._id;
  }

  set name(name: string) {
    this._name = name;
  }

  @Column()
  get name(): string {
    return this._name;
  }

  set code(code: string) {
    this._code = code;
  }

  @Column()
  get code(): string {
    return this._code;
  }

  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  @Column({ name: 'is_active' })
  get isActive(): boolean {
    return this._isActive;
  }

  set deletedAt(deletedAt: number) {
    this._deletedAt = deletedAt;
  }

  @Column({ name: 'deleted_at_unix' })
  get deletedAt(): number {
    return this._deletedAt;
  }
}
