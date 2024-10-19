import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPackagesUserRelations1729215901168 implements MigrationInterface {
    name = 'AddPackagesUserRelations1729215901168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`package\` ADD \`user_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`package\` ADD CONSTRAINT \`FK_04a9cd5f7a04bd02cfc9c7e6450\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`package\` DROP FOREIGN KEY \`FK_04a9cd5f7a04bd02cfc9c7e6450\``);
        await queryRunner.query(`ALTER TABLE \`package\` DROP COLUMN \`user_id\``);
    }

}
