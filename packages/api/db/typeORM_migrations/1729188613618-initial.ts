import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1729188613618 implements MigrationInterface {
    name = 'Initial1729188613618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`token\` varchar(255) NOT NULL, \`kind\` enum ('recover_password', 'refresh', 'access') NOT NULL, \`user_id\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_d9959ee7e17e2293893444ea37\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`full_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`token\` ADD CONSTRAINT \`FK_e50ca89d635960fda2ffeb17639\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` DROP FOREIGN KEY \`FK_e50ca89d635960fda2ffeb17639\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_d9959ee7e17e2293893444ea37\` ON \`token\``);
        await queryRunner.query(`DROP TABLE \`token\``);
    }

}
