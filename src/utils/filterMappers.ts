import type { SaleStatus } from "../types/sale";
import type { StockMovementType } from "../types/stockMovement";

export type ProductStatusFilter = "all" | "active" | "inactive";

export type SaleStatusFilter = "all" | "completed" | "cancelled";

export type StockMovementTypeFilter = "all" | "in" | "out" | "adjustment";

export function mapProductStatusToIsActive(
  status: ProductStatusFilter
): boolean | undefined {
  if (status === "all") return undefined;

  return status === "active";
}

export function mapSaleStatusToApiStatus(
  status: SaleStatusFilter
): SaleStatus | undefined {
  if (status === "all") return undefined;

  return status === "completed" ? 1 : 2;
}

export function mapStockMovementTypeToApiType(
  type: StockMovementTypeFilter
): StockMovementType | undefined {
  if (type === "all") return undefined;

  if (type === "in") return 1;

  if (type === "out") return 2;

  return 3;
}