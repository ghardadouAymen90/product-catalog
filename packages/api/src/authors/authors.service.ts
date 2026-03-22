import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import type { PaginatedResponse } from '../common/types';
import { PaginationHelper } from '../common/utils/pagination.helper';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async findAllWithPagination(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Author>> {
    const { page: validPage, limit: validLimit } = PaginationHelper.validateAndNormalize(page, limit);
    const skip = PaginationHelper.calculateSkip(validPage, validLimit);

    const [items, total] = await this.authorsRepository.findAndCount({
      relations: ['reviews'],
      skip,
      take: validLimit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page: validPage,
      limit: validLimit,
      pages: PaginationHelper.calculatePages(total, validLimit),
    };
  }

  async findOne(id: number): Promise<Author | null> {
    return this.authorsRepository.findOne({
      where: { id },
      relations: ['reviews', 'reviews.product'],
    });
  }

  async findByType(type: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Author>> {
    const { page: validPage, limit: validLimit } = PaginationHelper.validateAndNormalize(page, limit);
    const skip = PaginationHelper.calculateSkip(validPage, validLimit);

    const [items, total] = await this.authorsRepository.findAndCount({
      where: { type },
      relations: ['reviews'],
      skip,
      take: validLimit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page: validPage,
      limit: validLimit,
      pages: PaginationHelper.calculatePages(total, validLimit),
    };
  }

  async getMostActiveAuthors(limit: number = 10): Promise<Author[]> {
    return this.authorsRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.reviews', 'reviews')
      .addSelect('COUNT(reviews.id)', 'reviewCount')
      .groupBy('author.id')
      .orderBy('reviewCount', 'DESC')
      .limit(limit)
      .getMany();
  }
}
