import { useCallback, useEffect, useState } from "react";
import { cancelSale, getSales } from "../api/salesApi";
import { getApiErrorMessage } from "../api/apiError";
import type { Sale, SaleStatus } from "../types/sale";

function getSaleStatusLabel(status: SaleStatus) {
  if (status === 1) return "Completed";
  if (status === 2) return "Cancelled";

  return "Unknown";
}

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "completed" | "cancelled">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSales = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getSales({
        status:
          selectedStatus === "all"
            ? undefined
            : selectedStatus === "completed"
            ? 1
            : 2,
        from,
        to,
        pageNumber,
        pageSize: 10,
      });

      setSales(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load sales."));
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, from, to, pageNumber]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  async function handleCancelSale(saleId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this sale? Stock will be restored."
    );

    if (!confirmed) return;

    try {
      setError("");
      await cancelSale(saleId);
      await fetchSales();
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not cancel sale."));
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Sales</h1>
          <p>Review sales, filter by status and cancel transactions when needed.</p>
        </div>
      </div>

      <div className="toolbar">
        <select
          value={selectedStatus}
          onChange={(event) => {
            setSelectedStatus(
              event.target.value as "all" | "completed" | "cancelled"
            );
            setPageNumber(1);
          }}
        >
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={from}
          onChange={(event) => {
            setFrom(event.target.value);
            setPageNumber(1);
          }}
        />

        <input
          type="date"
          value={to}
          onChange={(event) => {
            setTo(event.target.value);
            setPageNumber(1);
          }}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <p>Loading sales...</p>
      ) : (
        <>
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
                        {sale.status === 1 ? (
                          <button
                            className="button button-danger"
                            onClick={() => handleCancelSale(sale.id)}
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="muted-text">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber((current) => current - 1)}
            >
              Previous
            </button>

            <span>
              Page {pageNumber} of {totalPages}
            </span>

            <button
              disabled={pageNumber === totalPages}
              onClick={() => setPageNumber((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}