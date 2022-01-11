import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUsersTable1641195758562 implements MigrationInterface {
    name = 'AddUsersTable1641195758562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "archived" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_deleted" TIMESTAMP WITH TIME ZONE, "last_updated_by" character varying, "created_by" character varying, "meta_data" jsonb DEFAULT '{}', "email" character varying NOT NULL, "phone" character varying NOT NULL, "password_hash" character varying NOT NULL, "need_password_change" boolean NOT NULL DEFAULT true, "last_login" TIMESTAMP WITH TIME ZONE DEFAULT now(), "login_count" integer NOT NULL DEFAULT '0', "failed_logins" integer NOT NULL DEFAULT '0', "confirmed" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT false, "last_seen" TIMESTAMP WITH TIME ZONE DEFAULT now(), "avatar_hash" character varying, "identity_provider" character varying, "profile" jsonb, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a3ffb1c0c8416b9fc6f907b743" ON "users" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a000cca60bcf04454e72769949" ON "users" ("phone") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a000cca60bcf04454e72769949"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3ffb1c0c8416b9fc6f907b743"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
