import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockProduct: Product = {
    id: 1,
    reference: 'PROD-001',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    currency: 'EUR',
    stock: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [],
  };

  const mockProducts = [mockProduct];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllWithPagination', () => {
    it('should return paginated products', async () => {
      const mockPaginatedData = {
        items: mockProducts,
        total: 1,
        page: 1,
        limit: 20,
        pages: 1,
      };

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([mockProducts, 1]);

      const result = await service.findAllWithPagination(1, 20);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['reviews', 'reviews.author'],
        skip: 0,
        take: 20,
      });
      expect(result.items).toEqual(mockProducts);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });

    it('should handle pagination with custom page and limit', async () => {
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([mockProducts, 100]);

      await service.findAllWithPagination(2, 10);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['reviews', 'reviews.author'],
        skip: 10,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockProduct);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['reviews', 'reviews.author'],
      });
      expect(result).toEqual(mockProduct);
    });

    it('should return null if product not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByReference', () => {
    it('should return a product by reference', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockProduct);

      const result = await service.findByReference('PROD-001');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { reference: 'PROD-001' },
        relations: ['reviews', 'reviews.author'],
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getMostAppreciatedProducts', () => {
    it('should return most appreciated products', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        having: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnValue('SELECT ...'),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(mockProducts),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValueOnce(mockQueryBuilder as any)
        .mockReturnValueOnce(mockQueryBuilder as any);

      const result = await service.getMostAppreciatedProducts(5);

      expect(result).toEqual(mockProducts);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getLowestRatedProducts', () => {
    it('should return lowest rated products', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        having: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnValue('SELECT ...'),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(mockProducts),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValueOnce(mockQueryBuilder as any)
        .mockReturnValueOnce(mockQueryBuilder as any);

      const result = await service.getLowestRatedProducts(5);

      expect(result).toEqual(mockProducts);
    });
  });
});
