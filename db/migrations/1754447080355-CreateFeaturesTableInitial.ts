import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFeaturesTableInitial1754447080355 implements MigrationInterface {
  name = 'CreateFeaturesTableInitial1754447080355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "features" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "description" text,
                CONSTRAINT "UQ_bcc3a344ae156a9fba128e1cb4d" UNIQUE ("name"),
                CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "features"
        `);
  }
}
