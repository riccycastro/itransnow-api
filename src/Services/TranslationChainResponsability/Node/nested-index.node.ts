import { Translation } from '../../../Entities/translation.entity';

export class NestedIndexNode {
    apply(translations: Translation[]) {
        const result = {};

        for (const translation of translations) {
            if (translation.translationKey.sections) {
                for (const section of translation.translationKey.sections) {
                    this.extend(result, `${section.alias}.${translation.translationKey.alias}`, translation.translation);
                }
            } else {
                this.extend(result, translation.translationKey.alias, translation.translation);
            }
        }
        return result;
    }

    private extend(result: {}, key: string, value: string) {
        const parts = key.split('.');

        for (let i = 0; i < parts.length; i++) {
            //create a property if it doesnt exist
            if (typeof result[parts[i]] == 'undefined') {
                if (i < (parts.length - 1))
                    result[parts[i]] = {};
                else {
                    result[parts[i]] = value;
                }
            }
            result = result[parts[i]];
        }
        return result;
    }
}
