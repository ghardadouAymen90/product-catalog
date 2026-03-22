import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import type { PaginatedResponse } from '../common/types';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Review>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.reviewsRepository.findAndCount({
      relations: ['product', 'author'],
      skip,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Review | null> {
    return this.reviewsRepository.findOne({
      where: { id },
      relations: ['product', 'author'],
    });
  }

  async findByProduct(
    productId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Review>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.reviewsRepository.findAndCount({
      where: { productId },
      relations: ['author'],
      skip,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findByAuthor(
    authorId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Review>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.reviewsRepository.findAndCount({
      where: { authorId },
      relations: ['product'],
      skip,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findByNotation(
    notation: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Review>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.reviewsRepository.findAndCount({
      where: { notation },
      relations: ['product', 'author'],
      skip,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

}
