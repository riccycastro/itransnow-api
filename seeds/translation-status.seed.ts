interface TranslationStatusSeedInterface {
  status: string
}

export const TranslationStatusSeed: TranslationStatusSeedInterface[] = [
  {
    status: 'approval_pending',
  },
  {
    status: 'approved',
  },
  {
    status: 'rejected',
  },
  {
    status: 'deprecated',
  }
];
