import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Product } from '../entities/product.entity';
import { Review } from '../entities/review.entity';
import { Author } from '../entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Review, Author])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
