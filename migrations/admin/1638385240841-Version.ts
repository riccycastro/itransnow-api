import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1638385240841 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `tenant` (`id` BIGINT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255),  `code` VARCHAR(255) UNIQUE, `is_active` TINYINT(1) DEFAULT 1, `deleted_at_unix` int (10) DEFAULT 0, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC));',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `tenant`;');
  }
}
