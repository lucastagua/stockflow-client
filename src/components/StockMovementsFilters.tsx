import type { Product } from "../types/product";

interface StockMovementsFiltersProps {
  selectedProductId: number;
  selectedType: "all" | "in" | "out" | "adjustment";
  from: string;
  to: string;
  pageSize: number;
  products: Product[];
  onProductChange: (value: number) => void;
  onTypeChange: (value: "all" | "in" | "out" | "adjustment") => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
}

export function StockMovementsFilters({
  selectedProductId,
  selectedType,
  from,
  to,
  pageSize,
  products,
  onProductChange,
  onTypeChange,
  onFromChange,
  onToChange,
  onPageSizeChange,
}: StockMovementsFiltersProps) {
  return (
    <div className="stock-movements-filters-card">
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
              event.target.value as "all" | "in" | "out" | "adjustment"
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
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
}