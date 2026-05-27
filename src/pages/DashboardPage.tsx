import { useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";
import type { DashboardSummary } from "../types/dashboard";
import { Boxes, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";
import { SummaryCard } from "../components/SummaryCard";

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

      <section className="summary-grid">
        <SummaryCard
          title="Total Products"
          value={summary.totalProducts}
          description="Registered products"
          icon={<Boxes size={22} />}
        />

        <SummaryCard
          title="Active Products"
          value={summary.activeProducts}
          description="Currently available"
          icon={<CheckCircle size={22} />}
        />

        <SummaryCard
          title="Low Stock"
          value={summary.lowStockProducts}
          description="Need attention"
          icon={<AlertTriangle size={22} />}
        />

        <SummaryCard
          title="Revenue"
          value={`$${summary.totalRevenueArs.toLocaleString("es-AR")}`}
          description="Completed sales"
          icon={<DollarSign size={22} />}
        />
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