import { Application } from '../src/Entities/application.entity';

interface TranslationKeySeedInterface {
  alias: string,
  application?: Application
}

export const TranslationKeySeed: TranslationKeySeedInterface[] = [
  {
    alias: 'vendors.edit.contacts.automatic_calls',
  },
  {
    alias: 'vendors.edit.contacts.automatic_calls_delay',
  },
  {
    alias: 'vendors.edit.contacts.automatic_calls_delay_description',
  },
  {
    alias: 'vendors.edit.contacts.offline_calls_disabled',
  },
];
