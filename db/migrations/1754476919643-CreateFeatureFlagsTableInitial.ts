import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFeatureFlagsTableInitial1754476919643 implements MigrationInterface {
  name = 'CreateFeatureFlagsTableInitial1754476919643';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
            ALTER TABLE "feature_flags"
            ADD CONSTRAINT "FK_b0564fcd9cfb5b4b9bd00429dea" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "feature_flags"
            ADD CONSTRAINT "FK_7b6bc54a58855a4ade4fb903651" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "feature_flags" DROP CONSTRAINT "FK_7b6bc54a58855a4ade4fb903651"
        `);
    await queryRunner.query(`
            ALTER TABLE "feature_flags" DROP CONSTRAINT "FK_b0564fcd9cfb5b4b9bd00429dea"
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
  }
}
