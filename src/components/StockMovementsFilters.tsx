import type { Product } from "../types/product";
import type { StockMovementTypeFilter } from "../utils/filterMappers";
import { PAGE_SIZE_OPTIONS } from "../constants/pagination";

interface StockMovementsFiltersProps {
  onClearFilters: () => void;
  selectedProductId: number;
  selectedType: StockMovementTypeFilter;
  from: string;
  to: string;
  pageSize: number;
  products: Product[];
  hasActiveFilters: boolean;
  onProductChange: (value: number) => void;
  onTypeChange: (value: StockMovementTypeFilter) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
}

export function StockMovementsFilters({
  onClearFilters,
  selectedProductId,
  selectedType,
  from,
  to,
  pageSize,
  products,
  hasActiveFilters,
  onProductChange,
  onTypeChange,
  onFromChange,
  onToChange,
  onPageSizeChange,
}: StockMovementsFiltersProps) {

  return (
    <div className="stock-movements-filters-card">
      <div className="filters-card-header">
        <span>Filters</span>

        {hasActiveFilters && (
          <span className="badge badge-warning">Filters active</span>
        )}
      </div>
      <div className="stock-movements-filters-row stock-movements-filters-main">
        <select
          value={selectedProductId}
          onChange={(event) => onProductChange(Number(event.target.value))}
        >
          <option value={0}>All products</option>

          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(event) =>
            onTypeChange(
              event.target.value as StockMovementTypeFilter
            )
          }
        >
          <option value="all">All movement types</option>
          <option value="in">In</option>
          <option value="out">Out</option>
          <option value="adjustment">Adjustment</option>
        </select>
      </div>

      <div className="stock-movements-filters-row stock-movements-filters-secondary">
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
      
      <div className="stock-movements-filters-actions">
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