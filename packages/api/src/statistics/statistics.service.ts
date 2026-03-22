import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Review } from '../entities/review.entity';
import { Author } from '../entities/author.entity';
import type { KPIResponse } from '../common/types';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async getKPIs(): Promise<KPIResponse> {
    const [productCount, reviewCount, authorCount] = await Promise.all([
      this.productsRepository.count(),
      this.reviewsRepository.count(),
      this.authorsRepository.count(),
    ]);

    return {
      totalProducts: productCount,
      totalReviews: reviewCount,
      totalAuthors: authorCount,
    };
  }

  async getAverageProductRating(): Promise<
    { raw: Record<string, number | string>[]; entities: Product[] }
  > {
    const result = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.reviews', 'review')
      .addSelect('AVG(CAST(review.notation AS FLOAT))', 'averageRating')
      .groupBy('product.id')
      .getRawAndEntities();

    return result;
  }
}
