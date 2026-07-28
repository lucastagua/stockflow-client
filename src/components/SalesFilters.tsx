interface SalesFiltersProps {
  selectedStatus: "all" | "completed" | "cancelled";
  from: string;
  to: string;
  pageSize: number;
  onStatusChange: (value: "all" | "completed" | "cancelled") => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
}

export function SalesFilters({
  selectedStatus,
  from,
  to,
  pageSize,
  onStatusChange,
  onFromChange,
  onToChange,
  onPageSizeChange,
}: SalesFiltersProps) {
  return (
    <div className="sales-filters-card">
      <div className="sales-filters-row sales-filters-main">
        <select
          value={selectedStatus}
          onChange={(event) =>
            onStatusChange(
              event.target.value as "all" | "completed" | "cancelled"
            )
          }
        >
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      <div className="sales-filters-row sales-filters-secondary">
        <input
          type="date"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
        />

        <input
          type="date"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
        />
      </div>
    </div>
  );
}