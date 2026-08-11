import type { RecentStockMovement } from "../types/dashboard";
import { EmptyState } from "./EmptyState";
import { formatDate } from "../utils/formatters";
import {
  getStockMovementTypeBadgeClass,
  getStockMovementTypeLabel,
} from "../utils/statusHelpers";

interface RecentStockMovementsListProps {
  movements: RecentStockMovement[];
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

                <span className={getStockMovementTypeBadgeClass(movement.type)}>
                  {getStockMovementTypeLabel(movement.type)}
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