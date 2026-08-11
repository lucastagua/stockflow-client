import type { SaleStatus } from "./sale";
import type { StockMovementType } from "./stockMovement";

export interface RecentSale {
  id: number;
  createdAt: string;
  totalAmountArs: number;
  status: SaleStatus;
}

export interface RecentStockMovement {
  id: number;
  productName: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  createdAt: string;
}

export interface DashboardSummary {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  completedSales: number;
  cancelledSales: number;
  totalRevenueArs: number;
  recentSales: RecentSale[];
  recentStockMovements: RecentStockMovement[];
}