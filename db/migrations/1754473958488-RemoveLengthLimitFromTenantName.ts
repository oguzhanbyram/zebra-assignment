import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLengthLimitFromTenantName1754473958488 implements MigrationInterface {
  name = 'RemoveLengthLimitFromTenantName1754473958488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tenants" DROP CONSTRAINT "UQ_32731f181236a46182a38c992a8"
        `);
    await queryRunner.query(`
            ALTER TABLE "tenants" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "tenants"
            ADD "name" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "tenants"
            ADD CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tenants" DROP CONSTRAINT "UQ_32731f181236a46182a38c992a8"
        `);
    await queryRunner.query(`
            ALTER TABLE "tenants" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "tenants"
            ADD "name" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "tenants"
            ADD CONSTRAINT "UQ_32731f181236a46182a38c992a8" UNIQUE ("name")
        `);
  }
}
