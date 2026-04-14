import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorsService } from './authors.service';
import { Author } from '../entities/author.entity';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let repository: Repository<Author>;

  const mockAuthor: Author = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    type: 'user',
    createdAt: new Date(),
    reviews: [],
  };

  const mockAuthors = [mockAuthor];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    repository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllWithPagination', () => {
    it('should return all authors with pagination', async () => {
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([mockAuthors, 1]);

      const result = await service.findAllWithPagination(1, 20);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['reviews'],
        skip: 0,
        take: 20,
        order: { createdAt: 'DESC' },
      });
      expect(result.items).toEqual(mockAuthors);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return an author by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockAuthor);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['reviews', 'reviews.product'],
      });
      expect(result).toEqual(mockAuthor);
    });

    it('should return null if author not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByType', () => {
    it('should return authors by type', async () => {
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([mockAuthors, 1]);

      const result = await service.findByType('user', 1, 20);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { type: 'user' },
        relations: ['reviews'],
        skip: 0,
        take: 20,
        order: { createdAt: 'DESC' },
      });
      expect(result.items).toEqual(mockAuthors);
    });
  });

  describe('getMostActiveAuthors', () => {
    it('should return most active authors', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(mockAuthors),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValueOnce(mockQueryBuilder as any);

      const result = await service.getMostActiveAuthors(10);

      expect(result).toEqual(mockAuthors);
    });
  });
});

