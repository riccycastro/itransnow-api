interface TranslationStatusSeedInterface {
  status: string
}

export const TranslationStatusSeed: TranslationStatusSeedInterface[] = [
  {
    status: 'submitted',
  },
  {
    status: 'approved',
  },
  {
    status: 'rejected',
  },
];
