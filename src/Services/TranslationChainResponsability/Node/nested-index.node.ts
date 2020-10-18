import { TranslationExportData } from '../../../Types/type';

export class NestedIndexNode {
  apply(translationExportDataArray: TranslationExportData[]) {
    const result = {};

    for (const translationExportData of translationExportDataArray) {
      if (translationExportData.section) {
          this.extend(
            result,
            `${translationExportData.section}.${translationExportData.translationKey}`,
            translationExportData.translation,
          );
      } else {
        this.extend(
          result,
          translationExportData.translationKey,
          translationExportData.translation,
        );
      }
    }
    return result;
  }

  private extend(result: {}, key: string, value: string) {
    const parts = key.split('.');

    for (let i = 0; i < parts.length; i++) {
      //create a property if it doesnt exist
      if (typeof result[parts[i]] == 'undefined') {
        if (i < parts.length - 1) result[parts[i]] = {};
        else {
          result[parts[i]] = value;
        }
      }
      result = result[parts[i]];
    }
    return result;
  }
}
