import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class InsertInitialData1774179856824 implements MigrationInterface {
  public readonly name = 'InsertInitialData1774179856824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const dataPath = path.join(__dirname, '../../../../../', 'data', 'products.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const products = JSON.parse(rawData);

    for (const { reference, name, description, price, currency, stock, reviews } of products) {
      const productResult = await queryRunner.query(
        `INSERT INTO products (reference, name, description, price, currency, stock, "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING id`,
        [
          reference,
          name,
          description,
          price,
          currency,
          stock,
          new Date(),
          new Date(),
        ],
      );

      const productId = productResult[0].id;

      if (reviews && Array.isArray(reviews)) {
        for (const { author, notation, date, comment } of reviews) {
          const authorResult = await queryRunner.query(
            `INSERT INTO authors ("firstName", "lastName", type, "createdAt") 
             VALUES ($1, $2, $3, $4) 
             RETURNING id`,
            [
              author.firstName,
              author.lastName,
              author.type,
              new Date(),
            ],
          );

          const authorId = authorResult[0].id;

          await queryRunner.query(
            `INSERT INTO reviews (notation, date, comment, "productId", "authorId", "createdAt") 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              notation,
              new Date(date),
              comment,
              productId,
              authorId,
              new Date(),
            ],
          );
        }
      }
    }

    console.log('✓ Initial products data inserted successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM reviews`);
    await queryRunner.query(`DELETE FROM products`);
    await queryRunner.query(`DELETE FROM authors`);
    console.log('✓ Initial products data rolled back');
  }
}
