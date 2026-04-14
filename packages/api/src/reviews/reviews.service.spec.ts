import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewsService } from './reviews.service';
import { Review } from '../entities/review.entity';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let repository: Repository<Review>;

  const mockReview: Review = {
    id: 1,
    notation: 5,
    date: new Date(),
    comment: 'Great product!',
    productId: 1,
    authorId: 1,
    createdAt: new Date(),
    product: undefined,
    author: undefined,
  };

  const mockReviews = [mockReview];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    repository = module.get<Repository<Review>>(getRepositoryToken(Review));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllWithPagination', () => {
    it('should return paginated reviews', async () => {
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([mockReviews, 1]);

      const result = await service.findAllWithPagination(1, 20);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['product', 'author'],
        skip: 0,
        take: 20,
        order: { date: 'DESC' },
      });
      expect(result.items).toEqual(mockReviews);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a review by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockReview);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['product', 'author'],
      });
      expect(result).toEqual(mockReview);
    });
  });

  describe('findByProduct', () => {
    it('should return reviews by product id', async () => {
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([mockReviews, 1]);

      const result = await service.findByProduct(1, 1, 20);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { productId: 1 },
        relations: ['author'],
        skip: 0,
        take: 20,
        order: { date: 'DESC' },
      });
      expect(result.items).toEqual(mockReviews);
    });
  });

  describe('findByAuthor', () => {
    it('should return reviews by author id', async () => {
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([mockReviews, 1]);

      const result = await service.findByAuthor(1, 1, 20);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { authorId: 1 },
        relations: ['product'],
        skip: 0,
        take: 20,
        order: { date: 'DESC' },
      });
      expect(result.items).toEqual(mockReviews);
    });
  });

  describe('findByNotation', () => {
    it('should return reviews by notation', async () => {
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([mockReviews, 1]);

      const result = await service.findByNotation(5, 1, 20);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { notation: 5 },
        relations: ['product', 'author'],
        skip: 0,
        take: 20,
        order: { date: 'DESC' },
      });
      expect(result.items).toEqual(mockReviews);
    });
  });
});
