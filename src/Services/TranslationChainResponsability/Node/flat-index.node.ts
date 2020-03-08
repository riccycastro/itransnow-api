import {Translation} from "../../../Entities/translation.entity";

export class FlatIndexNode {
    apply(translations: Translation[]) {
        return translations.reduce((previousData: any, translation: Translation) => {
            previousData[translation.translationKey.alias] = translation.translation;
            return previousData;
        }, {});
    }
}
