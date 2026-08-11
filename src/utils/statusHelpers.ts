import type { SaleStatus } from "../types/sale";
import type { StockMovementType } from "../types/stockMovement";

export function getSaleStatusLabel(status: SaleStatus) {
  if (status === 1) return "Completed";
  if (status === 2) return "Cancelled";

  return "Unknown";
}

export function getSaleStatusBadgeClass(status: SaleStatus) {
  if (status === 1) return "badge badge-success";
  if (status === 2) return "badge badge-muted";

  return "badge badge-muted";
}

export function getStockMovementTypeLabel(type: StockMovementType) {
  if (type === 1) return "In";
  if (type === 2) return "Out";
  if (type === 3) return "Adjustment";

  return "Unknown";
}

export function getStockMovementTypeBadgeClass(type: StockMovementType) {
  if (type === 1) return "badge badge-success";
  if (type === 2) return "badge badge-warning";

  return "badge badge-muted";
}