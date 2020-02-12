import { User } from '../src/Entities/user.entity';
import { TranslationKey } from '../src/Entities/translation-key.entity';
import { Language } from '../src/Entities/language.entity';
import { TranslationStatus } from '../src/Entities/translation-status.entity';
import { LanguageTeam } from '../src/Entities/language-team.entity';

interface TranslationSeedInterface {
  translation: string,
  acceptedBy?: User,
  createdBy?: User,
  translationKey?: TranslationKey,
  language?: Language,
  translationStatus?: TranslationStatus,
  languageTeam?: LanguageTeam,
}
export const TranslationSeed: TranslationSeedInterface[] = [
  {
    translation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum finibus, neque non blandit sodales, libero nibh efficitur dui, in dapibus"
  },
  {
    translation: "amet, maximus ligula. Pellentesque vel nibh ac tortor so"
  },
  {
    translation: "pulvinar quis. Phasellus auctor finibus urna, quis interdum neque sollicitudin imperdiet. Nunc in maximus tellus. Pellentesque"
  },
  {
    translation: "Interdum et malesuada fames ac ante ipsum primis in faucibus"
  },
  {
    translation: "Mauris cursus ex vitae ipsum lacinia, vel aliquam dolor pulvinar. Morbi at dictum magna."
  },
  {
    translation: "Aliquam congue vestibulum venenatis. Aliquam a erat eleifend, tincidunt libero eu"
  },
  {
    translation: "Pellentesque ac sapien nibh. Pellentesque dictum porta cursus. Suspendisse ut justo id risus elementum hendrerit. Praesent finibus"
  },
  {
    translation: "Nulla suscipit vestibulum tellus id porta. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla id mauris at elit mattis lacinia."
  },
  {
    translation: " Curabitur dignissim, dui vel iaculis porta, diam ligula tempor magna, in consequat ex diam nec felis."
  },
  {
    translation: "Aliquam congue vestibulum venenatis. Aliquam a erat eleifend, tincidunt libero eu, sollicitudin risus."
  }
];