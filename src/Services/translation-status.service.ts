import { Injectable, NotFoundException } from '@nestjs/common';
import { AbstractEntityService } from './AbstractEntityService';
import { TranslationStatus } from '../Entities/translation-status.entity';
import { TranslationStatusRepository } from '../Repositories/translation-status.repository';

@Injectable()
export class TranslationStatusService extends AbstractEntityService<TranslationStatus> {

    static readonly APPROVAL_PENDING = 'approval_pending';
    static readonly APPROVED = 'approved';
    static readonly REJECTED = 'rejected';

    constructor(translationStatusRepository: TranslationStatusRepository) {
        super(translationStatusRepository);
    }

    async getByStatus(status: string): Promise<TranslationStatus> {
        const translationStatus = await this.repository.findOne({ where: { status: status } });

        if (!translationStatus) {
            throw new NotFoundException('translation status not found');
        }

        return translationStatus;
    }
}
