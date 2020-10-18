import { TranslationExportData } from '../../../Types/type';

export class FlatIndexNode {
  apply(translationExportDataArray: TranslationExportData[]) {
    return translationExportDataArray.reduce(
      (previousData: any, translationExportData: TranslationExportData) => {
        if (translationExportData.section) {
          previousData[translationExportData.section] = previousData[translationExportData.section]
            ? previousData[translationExportData.section]
            : {};
          previousData[translationExportData.section][translationExportData.translation_key] =
            translationExportData.translation;
        } else {
          previousData[translationExportData.translation_key] =
            translationExportData.translation;
        }
        return previousData;
      },
      {},
    );
  }
}
