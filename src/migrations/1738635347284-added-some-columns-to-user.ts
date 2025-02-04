import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSomeColumnsToUser1738635347284 implements MigrationInterface {
    name = 'AddedSomeColumnsToUser1738635347284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."channelType" AS ENUM('EMAIL', 'SMS', 'WHATSAPP')`);
        await queryRunner.query(`CREATE TABLE "register_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deletedAt" TIMESTAMP, "value" integer NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "channel" "public"."channelType" NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_fe8a419fa2d957d178e45726481" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."userStatus" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" "public"."userStatus" NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`CREATE TYPE "public"."userType" AS ENUM('SITE', 'DASH')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "application" "public"."userType" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "acceptTerms" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "codeId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_cc0d91abac9eb3b825f69be83e3" UNIQUE ("username", "application")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_91c83ef0cf36c4f33934544054a" FOREIGN KEY ("codeId") REFERENCES "register_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_91c83ef0cf36c4f33934544054a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_cc0d91abac9eb3b825f69be83e3"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "codeId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "acceptTerms"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "application"`);
        await queryRunner.query(`DROP TYPE "public"."userType"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."userStatus"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TABLE "register_code"`);
        await queryRunner.query(`DROP TYPE "public"."channelType"`);
    }

}
