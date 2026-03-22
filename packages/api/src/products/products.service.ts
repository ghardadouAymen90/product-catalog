import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import type { PaginatedResponse } from '../common/types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Product>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.productsRepository.findAndCount({
      relations: ['reviews', 'reviews.author'],
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
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
    const products = await this.productsRepository.find({
      relations: ['reviews', 'reviews.author'],
      order: { createdAt: 'DESC' },
    });

    const productsWithCount = products.map((product) => {
      const positiveReviewCount = product.reviews?.filter(
        (review) => review.notation > 3,
      ).length || 0;
      return { product, positiveReviewCount };
    });

    return productsWithCount
      .sort((a, b) => b.positiveReviewCount - a.positiveReviewCount)
      .slice(0, limit)
      .map((item) => item.product);
  }

  async getLowestRatedProducts(limit: number = 5): Promise<Product[]> {
    const products = await this.productsRepository.find({
      relations: ['reviews', 'reviews.author'],
      order: { createdAt: 'DESC' },
    });

    const productsWithRating = products
      .map((product) => {
        const average =
          product.reviews?.length && product.reviews.length > 0
            ? product.reviews.reduce((sum, review) => sum + review.notation, 0) /
              product.reviews.length
            : 0;
        return { product, average };
      })
      .filter((item) => item.average < 3);

    return productsWithRating
      .sort((a, b) => a.average - b.average)
      .slice(0, limit)
      .map((item) => item.product);
  }
}
