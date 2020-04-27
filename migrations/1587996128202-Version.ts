import { getRepository, MigrationInterface, QueryRunner, Repository, TableColumn } from 'typeorm';
import { Translation } from '../src/Entities/translation.entity';
import { StringProvider } from '../src/Services/Provider/string.provider';

export class Version1587996128202 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const stringProvider = new StringProvider();
        const translationRepository: Repository<Translation> = await getRepository(Translation);

        const tableColumn = new TableColumn();
        tableColumn.name = 'alias';
        tableColumn.type = 'VARCHAR(45)';
        tableColumn.isNullable = false;

        await queryRunner.addColumn('translations', tableColumn);

        const translations = await translationRepository.find();

        const updateTranslationTask = [];

        for (const translation of translations) {
            translation.alias = stringProvider.generateRandomStringWithLength10();
            updateTranslationTask.push(translationRepository.save(translation));
        }

        await Promise.all(updateTranslationTask);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('translations', 'alias');
    }
}
