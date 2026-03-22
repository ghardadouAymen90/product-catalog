export class PaginationHelper {
  static validateAndNormalize(page: string | number = '1', limit: string | number = '20'): { page: number; limit: number } {
    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 20));
    return { page: pageNum, limit: limitNum };
  }

  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static calculatePages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }
}
