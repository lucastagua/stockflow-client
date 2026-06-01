import { axiosClient } from "./axiosClient";
import type {
  PagedResponse,
  StockMovement,
  StockMovementFilters,
} from "../types/stockMovement";

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