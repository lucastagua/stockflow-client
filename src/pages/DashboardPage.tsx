import { useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";
import type { DashboardSummary } from "../types/dashboard";
import { Boxes, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";
import { SummaryCard } from "../components/SummaryCard";
import { RecentSalesList } from "../components/RecentSalesList";
import { RecentStockMovementsList } from "../components/RecentStockMovementsList";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";

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
    return <LoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
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
        <div className="dashboard-columns">
          <RecentSalesList sales={summary.recentSales} />
          <RecentStockMovementsList movements={summary.recentStockMovements} />
        </div>
      </section>
    </main>
  );
}