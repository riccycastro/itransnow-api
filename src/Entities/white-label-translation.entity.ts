import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { WhiteLabel } from './white-label.entity';
import { TranslationKey } from './translation-key.entity';
import { Translation } from './translation.entity';

@Entity('white_label_translations')
export class WhiteLabelTranslation {

  @Exclude()
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number;

  @ManyToOne(type => WhiteLabel, whiteLabel => whiteLabel.whiteLabelTranslations)
  @JoinColumn({ name: 'white_label_id' })
  whiteLabel: WhiteLabel;

  @ManyToOne(type => TranslationKey, translationKey => translationKey.whiteLabelTranslations)
  @JoinColumn({ name: 'translation_key_id' })
  translationKey: TranslationKey;

  @ManyToOne(type => Translation, translation => translation.whiteLabelTranslations)
  @JoinColumn({ name: 'translation_key_id' })
  translation: Translation;
}
