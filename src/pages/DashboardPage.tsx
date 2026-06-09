import { useCallback, useEffect, useState } from "react";
import { getDashboardSummary } from "../api/dashboardApi";
import type { DashboardSummary } from "../types/dashboard";
import { Boxes, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";
import { SummaryCard } from "../components/SummaryCard";
import { RecentSalesList } from "../components/RecentSalesList";
import { RecentStockMovementsList } from "../components/RecentStockMovementsList";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchDashboardSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getDashboardSummary({
        from,
        to,
      });

      setSummary(data);
    } catch {
      setError("Could not load dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  function handleClearFilters() {
    setFrom("");
    setTo("");
  }

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
      <PageHeader
        title="Dashboard"
        description="Overview of your business activity and inventory status."
      />

      <div className="toolbar">
        <input
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
        />

        <input
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
        />

        <button className="button button-secondary" type="button" onClick={handleClearFilters}>
          Clear filters
        </button>
      </div>

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