import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1639701135257 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO `tenant` (`name`, `code`, `is_active`) VALUES ('Inventsys', 'inventsys', 1);",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM `tenant` WHERE `code` = 'inventsys';");
  }
}
