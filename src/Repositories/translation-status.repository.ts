import {EntityRepository} from "typeorm";
import {TranslationStatus} from "../Entities/translation-status.entity";
import {AbstractRepository} from "./abstract.repository";

@EntityRepository(TranslationStatus)
export class TranslationStatusRepository extends AbstractRepository<TranslationStatus>{

}
