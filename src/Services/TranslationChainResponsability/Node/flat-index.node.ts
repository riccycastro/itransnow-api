import { TranslationExportData } from '../../../Types/type';

export class FlatIndexNode {
  apply(translationExportDataArray: TranslationExportData[]) {
    return translationExportDataArray.reduce(
      (previousData: any, translationExportData: TranslationExportData) => {
        if (translationExportData.section) {
          previousData[translationExportData.section] = previousData[translationExportData.section]
            ? previousData[translationExportData.section]
            : {};
          previousData[translationExportData.section][translationExportData.translationKey] =
            translationExportData.translation;
        } else {
          previousData[translationExportData.translationKey] =
            translationExportData.translation;
        }
        return previousData;
      },
      {},
    );
  }
}
