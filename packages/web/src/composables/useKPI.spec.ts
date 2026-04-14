import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useKPI } from './useKPI';

vi.mock('../services/api', () => ({
  apiService: {
    getKPI: vi.fn(),
  },
}));

describe('useKPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default KPI values', () => {
    const { kpi, loading } = useKPI();

    expect(loading.value).toBe(false);
    expect(kpi.value).toEqual({
      totalProducts: 0,
      totalReviews: 0,
      totalAuthors: 0,
    });
  });

  it('should have fetchKPI function', () => {
    const { fetchKPI } = useKPI();

    expect(typeof fetchKPI).toBe('function');
  });
});
