import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPackagesTable1729215587329 implements MigrationInterface {
    name = 'AddPackagesTable1729215587329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`package\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`name\` varchar(255) NOT NULL, \`themes\` json NOT NULL, \`version\` float NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`package\``);
    }

}
