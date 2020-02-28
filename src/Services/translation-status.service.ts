import {Injectable} from "@nestjs/common";
import {AbstractEntityService} from "./AbstractEntityService";
import {TranslationStatus} from "../Entities/translation-status.entity";
import {TranslationStatusRepository} from "../Repositories/translation-status.repository";

@Injectable()
export class TranslationStatusService extends AbstractEntityService<TranslationStatus> {

    static readonly APPROVAL_PENDING = 'approval_pending';
    static readonly APPROVED = 'approved';
    static readonly REJECTED = 'rejected';

    constructor(translationStatusRepository: TranslationStatusRepository) {
        super(translationStatusRepository);
    }

    async getByStatus(status: string): Promise<TranslationStatus> {
        return await this.repository.findOne({where: {status: status}});
    }
}
