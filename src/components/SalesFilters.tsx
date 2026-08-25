import type { SaleStatusFilter } from "../utils/filterMappers";
import { PAGE_SIZE_OPTIONS } from "../constants/pagination";

interface SalesFiltersProps {
  onClearFilters: () => void;
  selectedStatus: SaleStatusFilter;
  from: string;
  to: string;
  pageSize: number;
  hasActiveFilters: boolean;
  onStatusChange: (value: SaleStatusFilter) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
}

export function SalesFilters({
  onClearFilters,
  selectedStatus,
  from,
  to,
  pageSize,
  hasActiveFilters,
  onStatusChange,
  onFromChange,
  onToChange,
  onPageSizeChange,
}: SalesFiltersProps) {

  return (
    <div className="sales-filters-card">
      <div className="filters-card-header">
        <span>Filters</span>

        {hasActiveFilters && (
          <span className="badge badge-warning">Filters active</span>
        )}
      </div>
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

      <div className="sales-filters-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      </div>
      
    </div>
  );
}