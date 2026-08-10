import type { RecentSale } from "../types/dashboard";
import { EmptyState } from "../components/EmptyState";
import { formatCurrencyArs, formatDate } from "../utils/formatters";

interface RecentSalesListProps {
  sales: RecentSale[];
}

function getSaleStatusLabel(status: number) {
  if (status === 1) return "Completed";
  if (status === 2) return "Cancelled";

  return "Unknown";
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
                <span
                  className={
                    sale.status === 1
                      ? "badge badge-success"
                      : "badge badge-muted"
                  }
                >
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