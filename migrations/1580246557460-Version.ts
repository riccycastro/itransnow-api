import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1580246557460 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('CREATE TABLE IF NOT EXISTS `companies` (`id` BIGINT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NULL, `alias` VARCHAR(45) NOT NULL, `is_active` TINYINT(1) DEFAULT 1, `deleted_at_unix` int (10) DEFAULT 0, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC))');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `users` (`id` BIGINT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NOT NULL, `username` VARCHAR(100) UNIQUE NOT NULL, `email` VARCHAR(255) UNIQUE NOT NULL, `password` VARCHAR(255) NOT NULL, `is_active` TINYINT(1) DEFAULT 1, `is_visible` TINYINT(1) DEFAULT 1, `is_admin` TINYINT(1) DEFAULT 0, `deleted_at_unix` int (10) DEFAULT 0, `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, `company_id` BIGINT DEFAULT NULL, PRIMARY KEY (`id`), INDEX `fk_users_companies1_idx` (`company_id` ASC), CONSTRAINT `fk_users_companies1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `applications` ( `id` BIGINT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NULL, `alias` VARCHAR(45) NOT NULL, `is_active` TINYINT(1) DEFAULT 1, `deleted_at_unix` int (10) DEFAULT 0, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, `company_id` BIGINT NOT NULL, PRIMARY KEY (`id`, `company_id`), INDEX `fk_applications_companies1_idx` (`company_id` ASC), CONSTRAINT `fk_applications_companies1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `languages` ( `id` BIGINT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NULL, `code` VARCHAR(45) NULL, `is_active` TINYINT(1) DEFAULT 1, `deleted_at_unix` int (10) DEFAULT 0, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`id`));');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `application_languages` (`application_id` BIGINT NOT NULL, `language_id` BIGINT NOT NULL, PRIMARY KEY (`application_id`, `language_id`), INDEX `fk_applications_has_languages_languages1_idx` (`language_id` ASC), INDEX `fk_applications_has_languages_applications1_idx` (`application_id` ASC), CONSTRAINT `fk_applications_has_languages_applications1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `fk_applications_has_languages_languages1` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `language_teams` ( `id` BIGINT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NULL, `alias` VARCHAR(45) NOT NULL, `is_active` TINYINT(1) DEFAULT 1, `deleted_at_unix` int (10) DEFAULT 0, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, `company_id` BIGINT NOT NULL, `language_id` BIGINT NOT NULL, PRIMARY KEY (`id`, `company_id`, `language_id`), INDEX `fk_language_teams_companies1_idx` (`company_id` ASC), INDEX `fk_language_teams_languages1_idx` (`language_id` ASC), CONSTRAINT `fk_language_teams_companies1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT `fk_language_teams_languages1` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `language_team_users` ( `id` BIGINT NOT NULL AUTO_INCREMENT, `is_manager` TINYINT(1) DEFAULT 0, `language_team_id` BIGINT NOT NULL, `user_id` BIGINT NOT NULL, PRIMARY KEY (`id`, `language_team_id`, `user_id`), INDEX `fk_language_teams_has_users_users1_idx` (`user_id` ASC), INDEX `fk_language_teams_has_users_language_teams1_idx` (`language_team_id` ASC), CONSTRAINT `fk_language_teams_has_users_language_teams1` FOREIGN KEY (`language_team_id`) REFERENCES `language_teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `fk_language_teams_has_users_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `sections` ( `id` BIGINT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NULL, `alias` VARCHAR(255) UNIQUE NOT NULL, `is_active` TINYINT(1) DEFAULT 1, `deleted_at_unix` int (10) DEFAULT 0, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, `application_id` BIGINT NOT NULL, PRIMARY KEY (`id`, `application_id`), INDEX `fk_categories_applications1_idx` (`application_id` ASC), CONSTRAINT `fk_categories_applications1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `translation_keys` ( `id` BIGINT NOT NULL AUTO_INCREMENT, `alias` VARCHAR(255) UNIQUE NOT NULL, `is_active` TINYINT(1) DEFAULT 1, `deleted_at_unix` int (10) DEFAULT 0, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, `application_id` BIGINT NOT NULL, PRIMARY KEY (`id`, `application_id`), INDEX `fk_translation_keys_applications1_idx` (`application_id` ASC), CONSTRAINT `fk_translation_keys_applications1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `section_translation_key` (`section_id` BIGINT NOT NULL, `translation_key_id` BIGINT NOT NULL, PRIMARY KEY (`section_id`, `translation_key_id`), INDEX `fk_categories_has_translation_keys_translation_keys1_idx` (`translation_key_id` ASC), INDEX `fk_categories_has_translation_keys_categories1_idx` (`section_id` ASC), CONSTRAINT `fk_categories_has_translation_keys_categories1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT `fk_categories_has_translation_keys_translation_keys1` FOREIGN KEY (`translation_key_id`) REFERENCES `translation_keys` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `translation_status` (`id` BIGINT NOT NULL AUTO_INCREMENT, `status` VARCHAR(45) NULL, PRIMARY KEY (`id`));');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `translations` ( `id` BIGINT NOT NULL AUTO_INCREMENT, `translation` TEXT NULL, `accepted_by` BIGINT NULL, `created_by` BIGINT NOT NULL, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, `deleted_at_unix` int (10) DEFAULT 0, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `translation_key_id` BIGINT DEFAULT NULL, `language_id` BIGINT NOT NULL, `translation_status_id` BIGINT NOT NULL, `language_team_id` BIGINT, PRIMARY KEY (`id`, `created_by`, `language_id`, `translation_status_id`), INDEX `fk_translations_users1_idx` (`accepted_by` ASC), INDEX `fk_translations_translation_keys1_idx` (`translation_key_id` ASC), INDEX `fk_translations_languages1_idx` (`language_id` ASC), INDEX `fk_translations_translation_status1_idx` (`translation_status_id` ASC), INDEX `fk_translations_users2_idx` (`created_by` ASC), CONSTRAINT `fk_translations_users1` FOREIGN KEY (`accepted_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT `fk_translations_translation_keys1`FOREIGN KEY (`translation_key_id`)REFERENCES `translation_keys` (`id`)ON DELETE CASCADE ON UPDATE CASCADE,CONSTRAINT `fk_translations_languages1`FOREIGN KEY (`language_id`)REFERENCES `languages` (`id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `fk_translations_translation_status1` FOREIGN KEY (`translation_status_id`) REFERENCES `translation_status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT `fk_translations_users2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, FOREIGN KEY (`language_team_id`) REFERENCES `language_teams`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `comments` ( `id` BIGINT NOT NULL AUTO_INCREMENT, `comment` TEXT NULL, `submitted_at` DATETIME NULL, `translation_id` BIGINT NOT NULL, `comment_by` BIGINT NOT NULL, PRIMARY KEY (`id`, `translation_id`, `comment_by`), INDEX `fk_comments_translations1_idx` (`translation_id` ASC), INDEX `fk_comments_users1_idx` (`comment_by` ASC), CONSTRAINT `fk_comments_translations1` FOREIGN KEY (`translation_id`) REFERENCES `translations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT `fk_comments_users1` FOREIGN KEY (`comment_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `admins` ( `id` BIGINT NOT NULL AUTO_INCREMENT, `name` VARCHAR(100) NULL, `email` VARCHAR(100) NULL, `password` VARCHAR(254) NULL, `is_active` TINYINT(1) DEFAULT 1, `is_deleted` TINYINT(1) DEFAULT 0, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`id`));');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `application_language_teams` ( `language_team_id` BIGINT NOT NULL, `application_id` BIGINT NOT NULL, PRIMARY KEY (`language_team_id`, `application_id`), INDEX `fk_language_teams_has_applications_applications1_idx` (`application_id` ASC), INDEX `fk_language_teams_has_applications_language_teams1_idx` (`language_team_id` ASC), CONSTRAINT `fk_language_teams_has_applications_language_teams1` FOREIGN KEY (`language_team_id`) REFERENCES `language_teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `fk_language_teams_has_applications_applications1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `white_labels` ( `id` BIGINT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NOT NULL, `alias` VARCHAR(255) NOT NULL, `is_active` TINYINT(1) NOT NULL DEFAULT 1, `deleted_at_unix` int (10) DEFAULT 0, `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP, `application_id` BIGINT NOT NULL, PRIMARY KEY (`id`, `application_id`), INDEX `fk_brands_applications1_idx` (`application_id` ASC), CONSTRAINT `fk_brands_applications1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);');

    await queryRunner.query('CREATE TABLE IF NOT EXISTS `white_label_translations` (`id` BIGINT NOT NULL AUTO_INCREMENT, `white_label_id` BIGINT NOT NULL, `translation_key_id` BIGINT NOT NULL, `translation_id` BIGINT NOT NULL, PRIMARY KEY (`id`,`white_label_id`, `translation_key_id`, `translation_id`), INDEX `fk_white_label_translations_translation_keys1_idx` (`translation_key_id` ASC), INDEX `fk_white_label_translations_translations1_idx` (`translation_id` ASC), CONSTRAINT `fk_white_label_translations_white_labels1` FOREIGN KEY (`white_label_id`) REFERENCES `white_labels` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT `fk_white_label_translations_translation_keys1` FOREIGN KEY (`translation_key_id`) REFERENCES `translation_keys` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT `fk_white_label_translations_translations1` FOREIGN KEY (`translation_id`) REFERENCES `translations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION)');

    await queryRunner.query('ALTER TABLE `companies` ADD CONSTRAINT UNIQUE (alias, deleted_at_unix);');
    await queryRunner.query('ALTER TABLE `users` ADD CONSTRAINT UNIQUE (`email`, `deleted_at_unix`);');
    await queryRunner.query('ALTER TABLE `users` ADD CONSTRAINT UNIQUE (`username`, `deleted_at_unix`);');
    await queryRunner.query('ALTER TABLE `applications` ADD CONSTRAINT UNIQUE (`alias`, `deleted_at_unix`, `company_id`);');
    await queryRunner.query('ALTER TABLE `languages` ADD CONSTRAINT UNIQUE (`code`, `deleted_at_unix`);');
    await queryRunner.query('ALTER TABLE `language_teams` ADD CONSTRAINT UNIQUE (`alias`, `deleted_at_unix`, `company_id`);');
    await queryRunner.query('ALTER TABLE `sections` ADD CONSTRAINT UNIQUE (`alias`, `deleted_at_unix`, `application_id`);');
    await queryRunner.query('ALTER TABLE `translation_keys` ADD CONSTRAINT UNIQUE (`alias`, `deleted_at_unix`, `application_id`);');
    await queryRunner.query('ALTER TABLE `white_labels` ADD CONSTRAINT UNIQUE (`alias`, `deleted_at_unix`, `application_id`);');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `white_label_translations`;');
    await queryRunner.query('DROP TABLE `white_labels`;');
    await queryRunner.query('DROP TABLE `application_language_teams`;');
    await queryRunner.query('DROP TABLE `admins`;');
    await queryRunner.query('DROP TABLE `comments`;');
    await queryRunner.query('DROP TABLE `translations`;');
    await queryRunner.query('DROP TABLE `translation_status`;');
    await queryRunner.query('DROP TABLE `section_translation_key`;');
    await queryRunner.query('DROP TABLE `translation_keys`;');
    await queryRunner.query('DROP TABLE `sections`;');
    await queryRunner.query('DROP TABLE `language_team_users`;');
    await queryRunner.query('DROP TABLE `language_teams`;');
    await queryRunner.query('DROP TABLE `application_languages`;');
    await queryRunner.query('DROP TABLE `languages`;');
    await queryRunner.query('DROP TABLE `applications`;');
    await queryRunner.query('DROP TABLE `users`;');
    await queryRunner.query('DROP TABLE `companies`;');
  }
}
