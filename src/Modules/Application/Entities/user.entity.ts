import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Application } from './application.entity';

@Entity('users')
export class User {
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

  private _applications: Application[];

  @OneToMany((type) => Application, (application) => application.createdBy)
  get applications(): Application[] {
    return this._applications;
  }

  set applications(applications: Application[]) {
    this._applications = applications;
  }

  addApplication(application: Application) {
    this._applications.push(application);
  }
}
