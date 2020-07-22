import { Injectable, NotFoundException } from '@nestjs/common';
import { AbstractEntityService } from './abstract-entity.service';
import { TranslationStatus } from '../Entities/translation-status.entity';
import { TranslationStatusRepository } from '../Repositories/translation-status.repository';

export enum TranslationStatusEnum {
  approvalPending = 'approval_pending',
  approved = 'approved',
  rejected = 'rejected',
  deprecated = 'deprecated',
}

@Injectable()
export class TranslationStatusService extends AbstractEntityService<
  TranslationStatus
> {
  static readonly APPROVAL_PENDING = 'approval_pending';
  static readonly APPROVED = 'approved';
  static readonly REJECTED = 'rejected';
  static readonly DEPRECATED = 'deprecated';

  constructor(translationStatusRepository: TranslationStatusRepository) {
    super(translationStatusRepository);
  }

  async getByStatus(status: string): Promise<TranslationStatus> {
    const translationStatus = await this.repository.findOne({
      where: { status: status },
    });

    if (!translationStatus) {
      throw new NotFoundException('translation status not found');
    }

    return translationStatus;
  }

  async getTranslationStatusByTranslation(
    translationId: number,
  ): Promise<TranslationStatus> {
    return await (this
      .repository as TranslationStatusRepository).findTranslationStatus(
      translationId,
    );
  }

  static statusTranslationStateMachine(currentStatus: string) {
    switch (currentStatus) {
      case TranslationStatusService.APPROVAL_PENDING:
        return [
          TranslationStatusService.APPROVED,
          TranslationStatusService.REJECTED,
        ];
      case TranslationStatusService.APPROVED:
        return [TranslationStatusService.DEPRECATED];
      case TranslationStatusService.REJECTED:
        return [TranslationStatusService.APPROVED];
      case TranslationStatusService.DEPRECATED:
        return [];
      default:
        throw new NotFoundException(`Unknown state ${currentStatus}`);
    }
  }
}
