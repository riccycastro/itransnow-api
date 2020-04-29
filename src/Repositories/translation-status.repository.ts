import { EntityRepository } from 'typeorm';
import { TranslationStatus } from '../Entities/translation-status.entity';
import { AbstractRepository } from './abstract.repository';

@EntityRepository(TranslationStatus)
export class TranslationStatusRepository extends AbstractRepository<
  TranslationStatus
> {
  async findTranslationStatus(
    translationId: number,
  ): Promise<TranslationStatus> {
    return this.createQueryBuilder('translationStatus')
      .innerJoin('translationStatus.translations', 'translation')
      .where('translation.id = :translationId', { translationId })
      .getOne();
  }
}
