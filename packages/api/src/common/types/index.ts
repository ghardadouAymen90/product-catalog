import { Product } from '../../entities/product.entity';
import { Author } from '../../entities/author.entity';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface KPIResponse {
  totalProducts: number;
  totalReviews: number;
  totalAuthors: number;
}

export interface ProductWithRating {
  product: Product;
  averageRating?: number;
}

export interface AuthorActivity {
  author: Author;
  reviewCount: number;
}

export interface ProductAppreciation {
  product: Product;
  positiveReviewCount: number;
}

export interface RatingResult {
  product: Product;
  average: number;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}
