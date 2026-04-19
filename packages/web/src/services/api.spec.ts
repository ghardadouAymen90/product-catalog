import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiService } from './api';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('APIService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('getKPI', () => {
    it('should fetch KPI data successfully', async () => {
      const mockKPIData = {
        totalProducts: 100,
        totalReviews: 500,
        totalAuthors: 50,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockKPIData,
      });

      const result = await apiService.getKPI();

      expect(result).toEqual(mockKPIData);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/statistics/kpi');
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      await expect(apiService.getKPI()).rejects.toThrow('Failed to fetch KPI');
    });
  });

  describe('getMostAppreciatedProducts', () => {
    it('should fetch most appreciated products successfully', async () => {
      const mockProducts = [{
        id: 1,
        reference: 'PROD-001',
        name: 'Product 1',
        price: '99.99',
        stock: 50,
        reviews: [],
      }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await apiService.getMostAppreciatedProducts();

      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(99.99);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/products/appreciated/top');
    });

    it('should return empty array on error', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      const result = await apiService.getMostAppreciatedProducts();
      expect(result).toEqual([]);
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const result = await apiService.getMostAppreciatedProducts();
      expect(result).toEqual([]);
    });
  });

  describe('getLowestRatedProducts', () => {
    it('should fetch lowest rated products successfully', async () => {
      const mockProducts = [{
        id: 2,
        reference: 'PROD-002',
        name: 'Product 2',
        price: '49.99',
        stock: 10,
        reviews: [],
      }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await apiService.getLowestRatedProducts();

      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(49.99);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/products/lowest-rated');
    });

    it('should return empty array on error', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      const result = await apiService.getLowestRatedProducts();
      expect(result).toEqual([]);
    });
  });

  describe('getProductsPage', () => {
    it('should fetch products page successfully', async () => {
      const mockResponse = {
        items: [
          { id: 1, reference: 'PROD-001', name: 'Product 1', price: '99.99', stock: 50 },
          { id: 2, reference: 'PROD-002', name: 'Product 2', price: '49.99', stock: 30 },
        ],
        total: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.getProductsPage(1, 20);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(100);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.pages).toBe(5);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/products?page=1&limit=20');
    });

    it('should parse price as number', async () => {
      const mockResponse = {
        items: [
          { id: 1, reference: 'PROD-001', name: 'Product 1', price: '99.99', stock: 50 },
        ],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.getProductsPage(1, 20);

      expect(typeof result.items[0].price).toBe('number');
      expect(result.items[0].price).toBe(99.99);
    });

    it('should handle different page numbers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [], total: 0 }),
      });

      await apiService.getProductsPage(3, 50);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/products?page=3&limit=50');
    });

    it('should return empty items on error', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      const result = await apiService.getProductsPage(1, 20);

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.pages).toBe(0);
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const result = await apiService.getProductsPage(1, 20);

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should calculate pages correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [], total: 250 }),
      });

      const result = await apiService.getProductsPage(1, 50);
      expect(result.pages).toBe(5);
    });
  });
});
