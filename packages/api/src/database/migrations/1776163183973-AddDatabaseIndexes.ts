import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDatabaseIndexes1776163183973 implements MigrationInterface {
    name = 'AddDatabaseIndexes1776163183973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_233485dfe62fd31abbf1f7f69d" ON "authors" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_16c583e2fa97fe3cb45e91608f" ON "authors" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_abd1b9971dd6a77395fd0c7f03" ON "reviews" ("notation") `);
        await queryRunner.query(`CREATE INDEX "IDX_48770372f891b9998360e4434f" ON "reviews" ("authorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a6b3c434392f5d10ec17104366" ON "reviews" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_63fcb3d8806a6efd53dbc67430" ON "products" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c9fb58de893725258746385e1" ON "products" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_4631ffea43463f4991394ebf98" ON "products" ("reference") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4631ffea43463f4991394ebf98"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c9fb58de893725258746385e1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_63fcb3d8806a6efd53dbc67430"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a6b3c434392f5d10ec17104366"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48770372f891b9998360e4434f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abd1b9971dd6a77395fd0c7f03"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16c583e2fa97fe3cb45e91608f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_233485dfe62fd31abbf1f7f69d"`);
    }

}
