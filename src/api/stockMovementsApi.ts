import { axiosClient } from "./axiosClient";
import type {
  CreateStockMovementRequest,
  StockMovement,
  StockMovementFilters,
} from "../types/stockMovement";
import type { PagedResponse } from "../types/pagination";

export async function createStockMovement(movement: CreateStockMovementRequest) {
  const response = await axiosClient.post<StockMovement>(
    "/StockMovements",
    movement
  );

  return response.data;
}

export async function getStockMovements(filters: StockMovementFilters) {
  const response = await axiosClient.get<PagedResponse<StockMovement>>(
    "/StockMovements",
    {
      params: {
        productId: filters.productId,
        type: filters.type,
        from: filters.from || undefined,
        to: filters.to || undefined,
        pageNumber: filters.pageNumber,
        pageSize: filters.pageSize,
      },
    }
  );

  return response.data;
}