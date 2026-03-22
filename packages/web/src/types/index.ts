export interface Product {
  id: number;
  reference: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface Review {
  id: number;
  notation: number;
  date: string;
  comment: string;
  author: Author;
  createdAt: string;
}

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  type: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface KPIData {
  totalProducts: number;
  totalReviews: number;
  totalAuthors: number;
}
