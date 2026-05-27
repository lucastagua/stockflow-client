export interface RecentSale {
  id: number;
  createdAt: string;
  totalAmountArs: number;
  status: number;
}

export interface RecentStockMovement {
  id: number;
  productName: string;
  type: number;
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