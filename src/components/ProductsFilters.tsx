import type { Category } from "../types/category";
import type { ProductSortBy, SortDirection } from "../types/product";
import type { ProductStatusFilter } from "../utils/filterMappers";
import { PAGE_SIZE_OPTIONS } from "../constants/pagination";

interface ProductsFiltersProps {
  search: string;
  selectedCategoryId: number;
  selectedStatus: ProductStatusFilter;
  sortBy: ProductSortBy;
  sortDirection: SortDirection;
  pageSize: number;
  lowStock: boolean;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: number) => void;
  onStatusChange: (value: ProductStatusFilter) => void;
  onSortByChange: (value: ProductSortBy) => void;
  onSortDirectionChange: (value: SortDirection) => void;
  onPageSizeChange: (value: number) => void;
  onLowStockChange: (value: boolean) => void;
  onClearFilters: () => void;
}

export function ProductsFilters({
  search,
  selectedCategoryId,
  selectedStatus,
  sortBy,
  sortDirection,
  pageSize,
  lowStock,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onSortByChange,
  onSortDirectionChange,
  onPageSizeChange,
  onLowStockChange,
  onClearFilters,
}: ProductsFiltersProps) {

  return (
    <div className="products-filters-card">
      <div className="products-filters-row products-filters-main">
        <input
          type="text"
          placeholder="Search by name, brand or SKU..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <select
          value={selectedCategoryId}
          onChange={(event) => onCategoryChange(Number(event.target.value))}
        >
          <option value={0}>All categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(event) =>
            onStatusChange(
              event.target.value as ProductStatusFilter
            )
          }
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="products-filters-row products-filters-secondary">
        <select
          value={sortBy}
          onChange={(event) =>
            onSortByChange(event.target.value as ProductSortBy)
          }
        >
          <option value="createdAt">Sort by creation date</option>
          <option value="name">Sort by name</option>
          <option value="price">Sort by price</option>
          <option value="stock">Sort by stock</option>
        </select>

        <select
          value={sortDirection}
          onChange={(event) =>
            onSortDirectionChange(event.target.value as SortDirection)
          }
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
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

        <label className="checkbox-label products-low-stock-filter">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(event) => onLowStockChange(event.target.checked)}
          />
          Low stock only
        </label>

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