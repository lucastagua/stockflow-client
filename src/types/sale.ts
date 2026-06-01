export type SaleStatus = 1 | 2;

export interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPriceArs: number;
  subtotalArs: number;
}

export interface Sale {
  id: number;
  createdAt: string;
  totalAmountArs: number;
  status: SaleStatus;
  items: SaleItem[];
}

export interface PagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: T[];
}

export interface SaleFilters {
  status?: SaleStatus;
  from?: string;
  to?: string;
  pageNumber: number;
  pageSize: number;
}

export interface CreateSaleItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateSaleRequest {
  items: CreateSaleItemRequest[];
}