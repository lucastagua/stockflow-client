import type { RecentSale } from "../types/dashboard";
import { EmptyState } from "../components/EmptyState";
import { formatCurrencyArs, formatDate } from "../utils/formatters";
import {
  getSaleStatusBadgeClass,
  getSaleStatusLabel,
} from "../utils/statusHelpers";

interface RecentSalesListProps {
  sales: RecentSale[];
}

export function RecentSalesList({ sales }: RecentSalesListProps) {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h2>Recent Sales</h2>
      </div>

      {sales.length === 0 ? (
        <EmptyState message="No recent sales." />
      ) : (
        <div className="list-card">
          {sales.map((sale) => (
            <div key={sale.id} className="list-row">
              <div>
                <strong>Sale #{sale.id}</strong>
                <p>{formatDate(sale.createdAt)}</p>
              </div>

              <div className="list-row-right">
                <span className={getSaleStatusBadgeClass(sale.status)}>
                  {getSaleStatusLabel(sale.status)}
                </span>

                <strong>
                  {formatCurrencyArs(sale.totalAmountArs)}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}