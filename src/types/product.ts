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

export interface ProductFilters {
  pageNumber: number;
  pageSize: number;
  search?: string;
  categoryId?: number;
  isActive?: boolean;
  sortBy?: ProductSortBy;
  sortDirection?: SortDirection;
  lowStock?: boolean;
}

export interface CreateProductRequest {
  name: string;
  brand?: string;
  sku?: string;
  costUsd: number;
  profitMarginPercentage: number;
  stock: number;
  minimumStock: number;
  categoryId: number;
}

export interface UpdateProductRequest {
  name: string;
  brand?: string;
  sku?: string;
  costUsd: number;
  profitMarginPercentage: number;
  stock: number;
  minimumStock: number;
  categoryId: number;
}

export interface ProductFormValues {
  name: string;
  brand: string;
  sku: string;
  costUsd: number;
  profitMarginPercentage: number;
  stock: number;
  minimumStock: number;
  categoryId: number;
}

export type ProductSortBy = "name" | "price" | "stock" | "createdAt";

export type SortDirection = "asc" | "desc";