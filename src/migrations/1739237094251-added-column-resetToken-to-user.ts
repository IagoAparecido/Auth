import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedColumnResetTokenToUser1739237094251 implements MigrationInterface {
    name = 'AddedColumnResetTokenToUser1739237094251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "resetToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetToken"`);
    }

}
