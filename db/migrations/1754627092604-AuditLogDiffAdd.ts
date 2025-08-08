import { MigrationInterface, QueryRunner } from "typeorm";

export class AuditLogDiffAdd1754627092604 implements MigrationInterface {
    name = 'AuditLogDiffAdd1754627092604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "before"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "after"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "diff" jsonb
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "audit_logs" DROP COLUMN "diff"
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "after" jsonb
        `);
        await queryRunner.query(`
            ALTER TABLE "audit_logs"
            ADD "before" jsonb
        `);
    }

}
