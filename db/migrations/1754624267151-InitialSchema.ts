import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1754624267151 implements MigrationInterface {
    name = 'InitialSchema1754624267151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "features" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "key" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" text,
                CONSTRAINT "UQ_0cc5c687428b94489ce1edc3c5a" UNIQUE ("key"),
                CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."feature_flags_environment_enum" AS ENUM('dev', 'staging', 'prod')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."feature_flags_strategy_enum" AS ENUM('boolean', 'percentage', 'targeting')
        `);
        await queryRunner.query(`
            CREATE TABLE "feature_flags" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "environment" "public"."feature_flags_environment_enum" NOT NULL,
                "enabled" boolean NOT NULL DEFAULT true,
                "strategy" "public"."feature_flags_strategy_enum" NOT NULL DEFAULT 'boolean',
                "value" jsonb,
                "tenant_id" uuid NOT NULL,
                "feature_id" uuid NOT NULL,
                CONSTRAINT "UQ_197865b732cb331e5263e30cdf5" UNIQUE ("tenant_id", "feature_id", "environment"),
                CONSTRAINT "PK_db657d344e9caacfc9d5cf8bbac" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."tenants_plan_enum" AS ENUM('free', 'basic', 'pro')
        `);
        await queryRunner.query(`
            CREATE TABLE "tenants" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "description" text,
                "plan" "public"."tenants_plan_enum" NOT NULL DEFAULT 'free',
                "api_key" character varying,
                CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name"),
                CONSTRAINT "UQ_b72fd6a5bc2b69134a6ae7a558f" UNIQUE ("api_key"),
                CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'tenant')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'tenant',
                "tenant_id" uuid,
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."audit_logs_action_enum" AS ENUM('create', 'update', 'delete')
        `);
        await queryRunner.query(`
            CREATE TABLE "audit_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "resource" character varying NOT NULL,
                "resourceId" uuid NOT NULL,
                "action" "public"."audit_logs_action_enum" NOT NULL,
                "before" jsonb,
                "after" jsonb,
                "actorId" uuid NOT NULL,
                "actorName" character varying NOT NULL,
                CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "feature_flags"
            ADD CONSTRAINT "FK_b0564fcd9cfb5b4b9bd00429dea" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "feature_flags"
            ADD CONSTRAINT "FK_7b6bc54a58855a4ade4fb903651" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_109638590074998bb72a2f2cf08" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_109638590074998bb72a2f2cf08"
        `);
        await queryRunner.query(`
            ALTER TABLE "feature_flags" DROP CONSTRAINT "FK_7b6bc54a58855a4ade4fb903651"
        `);
        await queryRunner.query(`
            ALTER TABLE "feature_flags" DROP CONSTRAINT "FK_b0564fcd9cfb5b4b9bd00429dea"
        `);
        await queryRunner.query(`
            DROP TABLE "audit_logs"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."audit_logs_action_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "tenants"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."tenants_plan_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "feature_flags"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."feature_flags_strategy_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."feature_flags_environment_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "features"
        `);
    }

}
