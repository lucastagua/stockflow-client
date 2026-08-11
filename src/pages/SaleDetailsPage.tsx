import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../api/apiError";
import { getSaleById } from "../api/salesApi";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import type { Sale } from "../types/sale";
import { formatCurrencyArs, formatDateTime } from "../utils/formatters";
import {
  getSaleStatusBadgeClass,
  getSaleStatusLabel,
} from "../utils/statusHelpers";

export function SaleDetailsPage() {
  const { id } = useParams();

  const [sale, setSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSale() {
      const saleId = Number(id);

      if (!id || Number.isNaN(saleId) || saleId <= 0) {
        setError("Invalid sale ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getSaleById(saleId);

        setSale(data);
      } catch (error) {
        setError(getApiErrorMessage(error, "Could not load sale details."));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSale();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Loading sale details..." />;
  }

  if (error) {
    return (
      <div>
        <ErrorMessage message={error} />

        <Link className="button button-secondary" to="/sales">
          Back to Sales
        </Link>
      </div>
    );
  }

  if (!sale) {
    return null;
  }

  return (
    <div>
      <PageHeader
        title={`Sale #${sale.id}`}
        description="Review the complete transaction details."
        actions={
          <Link className="button button-secondary" to="/sales">
            Back to Sales
          </Link>
        }
      />

      <section className="sale-details-summary">
        <div className="summary-card">
          <p className="summary-card-title">Date</p>
          <h3>{formatDateTime(sale.createdAt)}</h3>
        </div>

        <div className="summary-card">
          <p className="summary-card-title">Status</p>

          <h3>
            <span className={getSaleStatusBadgeClass(sale.status)}>
              {getSaleStatusLabel(sale.status)}
            </span>
          </h3>
        </div>

        <div className="summary-card">
          <p className="summary-card-title">Total</p>
          <h3>
            {formatCurrencyArs(sale.totalAmountArs)}
          </h3>
        </div>
      </section>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price ARS</th>
              <th>Subtotal ARS</th>
            </tr>
          </thead>

          <tbody>
            {sale.items.map((item) => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>
                  {formatCurrencyArs(item.unitPriceArs)}
                </td>
                <td>
                  {formatCurrencyArs(item.subtotalArs)}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={3}>
                <strong>Total</strong>
              </td>

              <td>
                <strong>
                  {formatCurrencyArs(sale.totalAmountArs)}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}