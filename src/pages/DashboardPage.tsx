import { useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";
import type { DashboardSummary } from "../types/dashboard";

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardSummary() {
      try {
        const response = await axiosClient.get<DashboardSummary>(
          "/Dashboard/summary"
        );

        setSummary(response.data);
      } catch {
        setError("Could not load dashboard summary.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardSummary();
  }, []);

  if (isLoading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!summary) {
    return <p>No dashboard data available.</p>;
  }

  return (
    <main>
      <h1>StockFlow Dashboard</h1>

      <section>
        <div>
          <h3>Total Products</h3>
          <p>{summary.totalProducts}</p>
        </div>

        <div>
          <h3>Active Products</h3>
          <p>{summary.activeProducts}</p>
        </div>

        <div>
          <h3>Low Stock Products</h3>
          <p>{summary.lowStockProducts}</p>
        </div>

        <div>
          <h3>Total Revenue</h3>
          <p>${summary.totalRevenueArs.toLocaleString("es-AR")}</p>
        </div>
      </section>

      <section>
        <h2>Recent Sales</h2>

        {summary.recentSales.length === 0 ? (
          <p>No recent sales.</p>
        ) : (
          <ul>
            {summary.recentSales.map((sale) => (
              <li key={sale.id}>
                Sale #{sale.id} - ${sale.totalAmountArs.toLocaleString("es-AR")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Recent Stock Movements</h2>

        {summary.recentStockMovements.length === 0 ? (
          <p>No recent stock movements.</p>
        ) : (
          <ul>
            {summary.recentStockMovements.map((movement) => (
              <li key={movement.id}>
                {movement.productName} - {movement.previousStock} →{" "}
                {movement.newStock}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}