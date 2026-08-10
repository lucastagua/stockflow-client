import type { RecentStockMovement } from "../types/dashboard";
import { EmptyState } from "./EmptyState";
import { formatDate } from "../utils/formatters";

interface RecentStockMovementsListProps {
  movements: RecentStockMovement[];
}

function getMovementTypeLabel(type: number) {
  if (type === 1) return "In";
  if (type === 2) return "Out";
  if (type === 3) return "Adjustment";

  return "Unknown";
}

export function RecentStockMovementsList({
  movements,
}: RecentStockMovementsListProps) {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h2>Recent Stock Movements</h2>
      </div>

      {movements.length === 0 ? (
        <EmptyState message="No recent sales." />
      ) : (
        <div className="list-card">
          {movements.map((movement) => (
            <div key={movement.id} className="list-row">
              <div>
                <strong>{movement.productName}</strong>
                <p>{formatDate(movement.createdAt)}</p>
              </div>

              <div className="list-row-right">
                <span
                  className={
                    movement.type === 1
                      ? "badge badge-success"
                      : movement.type === 2
                      ? "badge badge-warning"
                      : "badge badge-muted"
                  }
                >
                  {getMovementTypeLabel(movement.type)}
                </span>

                <strong>
                  {movement.previousStock} → {movement.newStock}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}