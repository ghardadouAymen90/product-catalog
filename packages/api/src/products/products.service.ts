import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import type { PaginatedResponse } from '../common/types';
import { PaginationHelper } from '../common/utils/pagination.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAllWithPagination(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Product>> {
    const { page: validPage, limit: validLimit } = PaginationHelper.validateAndNormalize(page, limit);
    const skip = PaginationHelper.calculateSkip(validPage, validLimit);

    const [items, total] = await this.productsRepository.findAndCount({
      relations: ['reviews', 'reviews.author'],
      skip,
      take: validLimit,
    });

    return {
      items,
      total,
      page: validPage,
      limit: validLimit,
      pages: PaginationHelper.calculatePages(total, validLimit),
    };
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['reviews', 'reviews.author'],
    });
  }

  async findByReference(reference: string): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { reference },
      relations: ['reviews', 'reviews.author'],
    });
  }

  async getMostAppreciatedProducts(limit: number = 5): Promise<Product[]> {
    const topProductIds = this.productsRepository
      .createQueryBuilder('product')
      .select('product.id')
      .leftJoin('product.reviews', 'reviews')
      .groupBy('product.id')
      .having('COUNT(CASE WHEN reviews.notation > 3 THEN 1 END) > 0')
      .orderBy('COUNT(CASE WHEN reviews.notation > 3 THEN 1 END)', 'DESC')
      .limit(limit)
      .getQuery();

    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .leftJoinAndSelect('reviews.author', 'author')
      .where(`product.id IN (${topProductIds})`)
      .getMany();
  }

  async getLowestRatedProducts(limit: number = 5): Promise<Product[]> {
    const lowestRatedIds = this.productsRepository
      .createQueryBuilder('product')
      .select('product.id')
      .leftJoin('product.reviews', 'reviews')
      .groupBy('product.id')
      .having('AVG(reviews.notation) < 3 AND COUNT(reviews.notation) > 0')
      .orderBy('AVG(reviews.notation)', 'ASC')
      .limit(limit)
      .getQuery();

    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .leftJoinAndSelect('reviews.author', 'author')
      .where(`product.id IN (${lowestRatedIds})`)
      .getMany();
  }
}
