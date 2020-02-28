import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Translation } from './translation.entity';

@Entity('translation_status')
export class TranslationStatus {

  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number;

  @Column()
  status: string;

  @OneToMany(type => Translation, translation => translation.translationStatus)
  translations: Translation[];
}
