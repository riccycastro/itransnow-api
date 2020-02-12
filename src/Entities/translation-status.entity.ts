import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from './language.entity';
import { Translation } from './translation.entity';

@Entity('translation_status')
export class TranslationStatus {
  private _id: number;
  private _status: string;
  private _translations: Translation[];

  @PrimaryGeneratedColumn({type: 'bigint'})
  get id(): number { return this._id; }
  set id(id: number) { this._id = id; }

  @Column()
  get status(): string { return this._status; }
  set status(status: string) { this._status = status; }

  @OneToMany(type => Translation, translation => translation.translationStatus)
  get translations(): Translation[] { return this._translations; }
  set translations(translations: Translation[]) { this._translations = translations; }
}
