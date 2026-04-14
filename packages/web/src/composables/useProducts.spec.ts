import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMostAppreciatedProducts, useLowestRatedProducts } from './useProducts';

vi.mock('../services/api', () => ({
  apiService: {
    getMostAppreciatedProducts: vi.fn(),
    getLowestRatedProducts: vi.fn(),
  },
}));

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useMostAppreciatedProducts', () => {
    it('should initialize with empty products and loading false', () => {
      const { products, loading } = useMostAppreciatedProducts();

      expect(products.value).toEqual([]);
      expect(loading.value).toBe(false);
    });

    it('should have fetchProducts function', () => {
      const { fetchProducts } = useMostAppreciatedProducts();

      expect(typeof fetchProducts).toBe('function');
    });
  });

  describe('useLowestRatedProducts', () => {
    it('should initialize with empty products and loading false', () => {
      const { products, loading } = useLowestRatedProducts();

      expect(products.value).toEqual([]);
      expect(loading.value).toBe(false);
    });

    it('should have fetchProducts function', () => {
      const { fetchProducts } = useLowestRatedProducts();

      expect(typeof fetchProducts).toBe('function');
    });
  });
});
