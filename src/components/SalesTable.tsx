import { Link } from "react-router-dom";
import type { Sale, SaleStatus } from "../types/sale";

interface SalesTableProps {
  sales: Sale[];
  onCancel: (saleId: number) => void;
}

function getSaleStatusLabel(status: SaleStatus) {
  if (status === 1) return "Completed";
  if (status === 2) return "Cancelled";

  return "Unknown";
}

export function SalesTable({ sales, onCancel }: SalesTableProps) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total ARS</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan={6}>No sales found.</td>
            </tr>
          ) : (
            sales.map((sale) => (
              <tr key={sale.id}>
                <td>#{sale.id}</td>

                <td>{new Date(sale.createdAt).toLocaleDateString("es-AR")}</td>

                <td>
                  <div className="items-list">
                    {sale.items.map((item) => (
                      <span key={item.productId}>
                        {item.productName} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </td>

                <td>${sale.totalAmountArs.toLocaleString("es-AR")}</td>

                <td>
                  <span
                    className={
                      sale.status === 1
                        ? "badge badge-success"
                        : "badge badge-muted"
                    }
                  >
                    {getSaleStatusLabel(sale.status)}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <Link className="button button-secondary" to={`/sales/${sale.id}`}>
                      View
                    </Link>

                    {sale.status === 1 ? (
                      <button
                        className="button button-danger"
                        onClick={() => onCancel(sale.id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="muted-text">No actions</span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}