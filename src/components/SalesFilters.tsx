import type { SaleStatusFilter } from "../utils/filterMappers";
import { PAGE_SIZE_OPTIONS } from "../constants/pagination";

interface SalesFiltersProps {
  selectedStatus: SaleStatusFilter;
  from: string;
  to: string;
  pageSize: number;
  onStatusChange: (value: SaleStatusFilter) => void;
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
              event.target.value as SaleStatusFilter
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
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} per page
            </option>
          ))}
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