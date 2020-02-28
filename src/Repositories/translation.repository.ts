import {EntityRepository} from "typeorm";
import {Translation} from "../Entities/translation.entity";
import {AbstractRepository} from "./abstract.repository";
import {Language} from "../Entities/language.entity";

@EntityRepository(Translation)
export class TranslationRepository extends AbstractRepository<Translation> {

}