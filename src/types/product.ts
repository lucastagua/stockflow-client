export interface Product {
  id: number;
  name: string;
  brand: string | null;
  sku: string | null;
  costUsd: number;
  profitMarginPercentage: number;
  priceArs: number;
  stock: number;
  minimumStock: number;
  isActive: boolean;
  createdAt: string;
  categoryId: number;
  categoryName: string;
}

export interface PagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: T[];
}