import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1639503385790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `applications` ADD COLUMN `created_by` BIGINT NOT NULL, ADD CONSTRAINT `fk_applications_users` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `applications` DROP COLUMN `created_by`;',
    );
  }
}
