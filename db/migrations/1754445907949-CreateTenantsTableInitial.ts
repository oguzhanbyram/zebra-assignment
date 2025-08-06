import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantsTableInitial1754445907949 implements MigrationInterface {
  name = 'CreateTenantsTableInitial1754445907949';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "tenants" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying(50) NOT NULL,
                "description" text,
                CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name"),
                CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "tenants"
        `);
  }
}
