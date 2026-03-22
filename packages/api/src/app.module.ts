import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { Product } from './entities/product.entity';
import { Review } from './entities/review.entity';
import { Author } from './entities/author.entity';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthorsModule } from './authors/authors.module';
import { StatisticsModule } from './statistics/statistics.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([Product, Review, Author]),
    ProductsModule,
    ReviewsModule,
    AuthorsModule,
    StatisticsModule,
  ],
   providers: [DatabaseService]
})
export class AppModule {}
