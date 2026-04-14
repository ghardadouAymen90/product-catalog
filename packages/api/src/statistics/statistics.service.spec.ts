import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatisticsService } from './statistics.service';
import { Product } from '../entities/product.entity';
import { Review } from '../entities/review.entity';
import { Author } from '../entities/author.entity';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let productsRepository: Repository<Product>;
  let reviewsRepository: Repository<Review>;
  let authorsRepository: Repository<Author>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            count: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Review),
          useValue: {
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Author),
          useValue: {
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    productsRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    reviewsRepository = module.get<Repository<Review>>(
      getRepositoryToken(Review),
    );
    authorsRepository = module.get<Repository<Author>>(
      getRepositoryToken(Author),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getKPIs', () => {
    it('should return KPI statistics', async () => {
      jest.spyOn(productsRepository, 'count').mockResolvedValueOnce(10);
      jest.spyOn(reviewsRepository, 'count').mockResolvedValueOnce(50);
      jest.spyOn(authorsRepository, 'count').mockResolvedValueOnce(5);

      const result = await service.getKPIs();

      expect(result.totalProducts).toBe(10);
      expect(result.totalReviews).toBe(50);
      expect(result.totalAuthors).toBe(5);
    });

    it('should handle zero counts', async () => {
      jest.spyOn(productsRepository, 'count').mockResolvedValueOnce(0);
      jest.spyOn(reviewsRepository, 'count').mockResolvedValueOnce(0);
      jest.spyOn(authorsRepository, 'count').mockResolvedValueOnce(0);

      const result = await service.getKPIs();

      expect(result.totalProducts).toBe(0);
      expect(result.totalReviews).toBe(0);
      expect(result.totalAuthors).toBe(0);
    });
  });

  describe('getAverageProductRating', () => {
    it('should return average product ratings', async () => {
      const mockRawData = [
        { product_id: 1, averageRating: 4.5 },
        { product_id: 2, averageRating: 3.8 },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawAndEntities: jest
          .fn()
          .mockResolvedValueOnce({ raw: mockRawData, entities: [] }),
      };

      jest
        .spyOn(productsRepository, 'createQueryBuilder')
        .mockReturnValueOnce(mockQueryBuilder as any);

      const result = await service.getAverageProductRating();

      expect(result.raw).toEqual(mockRawData);
      expect(result.entities).toEqual([]);
    });
  });
});
