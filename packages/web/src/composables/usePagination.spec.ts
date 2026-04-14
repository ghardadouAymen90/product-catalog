import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePagination } from './usePagination';

vi.mock('../services/api', () => ({
  apiService: {
    getProductsPage: vi.fn(),
  },
}));

describe('usePagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { products, currentPage, itemsPerPage, totalProducts, loading } =
      usePagination();

    expect(products.value).toEqual([]);
    expect(currentPage.value).toBe(1);
    expect(itemsPerPage.value).toBe(20);
    expect(totalProducts.value).toBe(0);
    expect(loading.value).toBe(false);
  });

  it('should calculate total pages correctly', () => {
    const { totalProducts, itemsPerPage, totalPages } = usePagination();

    totalProducts.value = 100;
    itemsPerPage.value = 20;

    expect(totalPages.value).toBe(5);
  });

  it('should calculate start and end index correctly', () => {
    const { currentPage, itemsPerPage, totalProducts, startIndex, endIndex } =
      usePagination();

    currentPage.value = 2;
    itemsPerPage.value = 10;
    totalProducts.value = 50;

    expect(startIndex.value).toBe(11);
    expect(endIndex.value).toBe(20);
  });

  it('should calculate average rating correctly', () => {
    const { getAverageRating } = usePagination();

    const product = {
      id: 1,
      reference: 'PROD-001',
      name: 'Test Product',
      description: 'Test',
      price: 99.99,
      currency: 'EUR',
      stock: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviews: [
        { id: 1, notation: 5, date: new Date().toISOString(), comment: 'Great!', author: { id: 1, firstName: 'John', lastName: 'Doe', type: 'user', createdAt: new Date().toISOString() }, createdAt: new Date().toISOString() },
        { id: 2, notation: 4, date: new Date().toISOString(), comment: 'Good', author: { id: 2, firstName: 'Jane', lastName: 'Smith', type: 'user', createdAt: new Date().toISOString() }, createdAt: new Date().toISOString() },
        { id: 3, notation: 3, date: new Date().toISOString(), comment: 'OK', author: { id: 3, firstName: 'Bob', lastName: 'Johnson', type: 'user', createdAt: new Date().toISOString() }, createdAt: new Date().toISOString() },
      ],
    };

    expect(getAverageRating(product)).toBe(4);
  });

  it('should return 0 for average rating when no reviews', () => {
    const { getAverageRating } = usePagination();

    const product = {
      id: 1,
      reference: 'PROD-001',
      name: 'Test Product',
      description: 'Test',
      price: 99.99,
      currency: 'EUR',
      stock: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviews: [],
    };

    expect(getAverageRating(product)).toBe(0);
  });

  it('should calculate average price correctly', () => {
    const { products, getAveragePrice } = usePagination();

    products.value = [
      {
        id: 1,
        reference: 'PROD-001',
        name: 'Product 1',
        description: 'Test',
        price: 100,
        currency: 'EUR',
        stock: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviews: [],
      },
      {
        id: 2,
        reference: 'PROD-002',
        name: 'Product 2',
        description: 'Test',
        price: 200,
        currency: 'EUR',
        stock: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviews: [],
      },
    ];

    expect(getAveragePrice()).toBe(150);
  });

  it('should calculate total stock correctly', () => {
    const { products, getTotalStock } = usePagination();

    products.value = [
      {
        id: 1,
        reference: 'PROD-001',
        name: 'Product 1',
        description: 'Test',
        price: 100,
        currency: 'EUR',
        stock: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviews: [],
      },
      {
        id: 2,
        reference: 'PROD-002',
        name: 'Product 2',
        description: 'Test',
        price: 200,
        currency: 'EUR',
        stock: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviews: [],
      },
    ];

    expect(getTotalStock()).toBe(80);
  });

  it('should calculate total reviews correctly', () => {
    const { products, getTotalReviews } = usePagination();

    products.value = [
      {
        id: 1,
        reference: 'PROD-001',
        name: 'Product 1',
        description: 'Test',
        price: 100,
        currency: 'EUR',
        stock: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviews: [
          { id: 1, notation: 5, date: new Date().toISOString(), comment: 'Great!', author: { id: 1, firstName: 'John', lastName: 'Doe', type: 'user', createdAt: new Date().toISOString() }, createdAt: new Date().toISOString() },
          { id: 2, notation: 4, date: new Date().toISOString(), comment: 'Good', author: { id: 2, firstName: 'Jane', lastName: 'Smith', type: 'user', createdAt: new Date().toISOString() }, createdAt: new Date().toISOString() },
        ],
      },
      {
        id: 2,
        reference: 'PROD-002',
        name: 'Product 2',
        description: 'Test',
        price: 200,
        currency: 'EUR',
        stock: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviews: [
          { id: 3, notation: 3, date: new Date().toISOString(), comment: 'OK', author: { id: 3, firstName: 'Bob', lastName: 'Johnson', type: 'user', createdAt: new Date().toISOString() }, createdAt: new Date().toISOString() },
        ],
      },
    ];

    expect(getTotalReviews()).toBe(3);
  });
});
