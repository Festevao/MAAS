import { MigrationInterface, QueryRunner } from "typeorm";

export class TokenLengthImprove1729189367178 implements MigrationInterface {
    name = 'TokenLengthImprove1729189367178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_d9959ee7e17e2293893444ea37\` ON \`token\``);
        await queryRunner.query(`ALTER TABLE \`token\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`token\` ADD \`token\` varchar(1024) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` DROP COLUMN \`token\``);
        await queryRunner.query(`ALTER TABLE \`token\` ADD \`token\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_d9959ee7e17e2293893444ea37\` ON \`token\` (\`token\`)`);
    }

}
