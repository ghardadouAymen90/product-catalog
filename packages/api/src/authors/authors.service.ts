import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import type { PaginatedResponse } from '../common/types';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Author>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.authorsRepository.findAndCount({
      relations: ['reviews'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Author | null> {
    return this.authorsRepository.findOne({
      where: { id },
      relations: ['reviews', 'reviews.product'],
    });
  }

  async findByType(
    type: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Author>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.authorsRepository.findAndCount({
      where: { type },
      relations: ['reviews'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getMostActiveAuthors(limit: number = 10): Promise<Author[]> {
    const authors = await this.authorsRepository.find({
      relations: ['reviews'],
      order: { createdAt: 'DESC' },
    });

    const authorsWithCount = authors.map((author) => {
      const reviewCount = author.reviews?.length || 0;
      return { author, reviewCount };
    });

    return authorsWithCount
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, limit)
      .map((item) => item.author);
  }

}
