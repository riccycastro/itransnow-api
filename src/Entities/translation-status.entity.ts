import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Translation } from './translation.entity';
import { Exclude } from 'class-transformer';

@Entity('translation_status')
export class TranslationStatus {
  @Exclude()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  status: string;

  @OneToMany(type => Translation, translation => translation.translationStatus)
  translations: Translation[];
}
