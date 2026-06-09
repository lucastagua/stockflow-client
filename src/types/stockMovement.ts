export type StockMovementType = 1 | 2 | 3;

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string | null;
  createdAt: string;
}

export interface PagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: T[];
}

export interface StockMovementFilters {
  productId?: number;
  type?: StockMovementType;
  from?: string;
  to?: string;
  pageNumber: number;
  pageSize: number;
}

export interface CreateStockMovementRequest {
  productId: number;
  type: StockMovementType;
  quantity: number;
  reason?: string;
}