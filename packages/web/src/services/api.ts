import type { Product, KPIData, PaginatedResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

interface ApiResponse<T> {
  items?: T[];
  total?: number;
  [key: string]: unknown;
}

class APIService {
  private baseUrl = API_BASE_URL;

  async getKPI(): Promise<KPIData> {
    const response = await fetch(`${this.baseUrl}/statistics/kpi`);
    if (!response.ok) throw new Error('Failed to fetch KPI');
    return response.json();
  }

  private normalizeProducts(data: unknown): Product[] {
    const products = Array.isArray(data)
      ? data
      : (data as Record<string, unknown>)?.items || [];

    return (products as Record<string, unknown>[]).map((p) => ({
      ...(p as Record<string, unknown>),
      price: typeof p.price === 'string' ? parseFloat(p.price as string) : (p.price as number),
    } as Product));
  }

  async getMostAppreciatedProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/appreciated/top`);
      if (!response.ok) throw new Error('Failed to fetch most appreciated products');
      const data = await response.json();
      return this.normalizeProducts(data);
    } catch (error) {
      console.error('Error fetching most appreciated products:', error);
      return [];
    }
  }

  async getLowestRatedProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/lowest-rated`);
      if (!response.ok) throw new Error('Failed to fetch lowest rated products');
      const data = await response.json();
      return this.normalizeProducts(data);
    } catch (error) {
      console.error('Error fetching lowest rated products:', error);
      return [];
    }
  }

  async getProductsPage(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Product>> {
    try {
      const url = `${this.baseUrl}/products?page=${page}&limit=${limit}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products page');
      const data = (await response.json()) as ApiResponse<Product>;

      return {
        items: this.normalizeProducts(data.items || data),
        total: (data.total as number) || (data.items as unknown[])?.length || 0,
        page: page,
        limit: limit,
        pages: Math.ceil(
          ((data.total as number) || (data.items as unknown[])?.length || 0) /
            limit,
        ),
      };
    } catch (error) {
      console.error('Error fetching products page:', error);
      return { items: [], total: 0, page, limit, pages: 0 };
    }
  }

}

export const apiService = new APIService();
