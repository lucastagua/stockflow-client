import type {
  StockMovement,
  StockMovementType,
} from "../types/stockMovement";
import { formatDate } from "../utils/formatters";

interface StockMovementsTableProps {
  movements: StockMovement[];
}

function getMovementTypeLabel(type: StockMovementType) {
  if (type === 1) return "In";
  if (type === 2) return "Out";
  if (type === 3) return "Adjustment";

  return "Unknown";
}

function getMovementBadgeClass(type: StockMovementType) {
  if (type === 1) return "badge badge-success";
  if (type === 2) return "badge badge-warning";

  return "badge badge-muted";
}

export function StockMovementsTable({
  movements,
}: StockMovementsTableProps) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Previous Stock</th>
            <th>New Stock</th>
            <th>Reason</th>
          </tr>
        </thead>

        <tbody>
          {movements.length === 0 ? (
            <tr>
              <td colSpan={7}>No stock movements found.</td>
            </tr>
          ) : (
            movements.map((movement) => (
              <tr key={movement.id}>
                <td>
                  {formatDate(movement.createdAt)}
                </td>

                <td>{movement.productName}</td>

                <td>
                  <span className={getMovementBadgeClass(movement.type)}>
                    {getMovementTypeLabel(movement.type)}
                  </span>
                </td>

                <td>{movement.quantity}</td>

                <td>{movement.previousStock}</td>

                <td>{movement.newStock}</td>

                <td>{movement.reason ?? "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}