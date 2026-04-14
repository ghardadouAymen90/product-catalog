import { DataSource } from 'typeorm';
import * as path from 'path';
import { Product } from '../entities/product.entity';
import { Review } from '../entities/review.entity';
import { Author } from '../entities/author.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'product_catalog',
  entities: [Product, Review, Author],
  migrations: [path.join(__dirname, './migrations/*.ts')],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  extra: {
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    max: parseInt(process.env.DB_POOL_MAX || '10'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
    statement_timeout: 30000,
    query_timeout: 30000,
  },
});
