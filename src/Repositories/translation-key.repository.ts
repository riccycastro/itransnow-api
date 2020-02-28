import {EntityRepository} from "typeorm";
import {TranslationKey} from "../Entities/translation-key.entity";
import {AbstractRepository} from "./abstract.repository";

@EntityRepository(TranslationKey)
export class TranslationKeyRepository extends AbstractRepository<TranslationKey> {
    async findByTranslationKey(companyId: number, applicationId: number, translationKey: string): Promise<TranslationKey> {
        return this.createQueryBuilder('translationKeys')
            .innerJoin('translationKeys.application', 'application')
            .innerJoin('application.company', 'company')
            .where('company.id = :companyId', {companyId: companyId})
            .andWhere('application.id = :applicationId', {applicationId: applicationId})
            .andWhere('translationKeys.alias = :translationKey', {translationKey: translationKey})
            .getOne();
    }
}
