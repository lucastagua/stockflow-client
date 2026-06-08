import type { RecentSale } from "../types/dashboard";
import { EmptyState } from "../components/EmptyState";

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
                <p>{new Date(sale.createdAt).toLocaleDateString("es-AR")}</p>
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
                  ${sale.totalAmountArs.toLocaleString("es-AR")}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}