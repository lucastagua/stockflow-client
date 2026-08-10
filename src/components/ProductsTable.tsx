import type { Product } from "../types/product";
import { formatCurrencyArs, formatCurrencyUsd } from "../utils/formatters";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDeactivate: (productId: number) => void;
  onRestore: (productId: number) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDeactivate,
  onRestore,
}: ProductsTableProps) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Cost USD</th>
            <th>Margin</th>
            <th>Price ARS</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={10}>No products found.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.brand ?? "-"}</td>
                <td>{product.sku ?? "-"}</td>
                <td>{product.categoryName}</td>
                <td>
                  <span
                    className={
                      product.stock <= product.minimumStock
                        ? "badge badge-warning"
                        : "badge badge-success"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td>{formatCurrencyUsd(product.costUsd)}</td>
                <td>{product.profitMarginPercentage}%</td>
                <td>{formatCurrencyArs(product.priceArs)}</td>
                <td>
                  <span
                    className={
                      product.isActive
                        ? "badge badge-success"
                        : "badge badge-muted"
                    }
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="button button-secondary"
                      onClick={() => onEdit(product)}
                    >
                      Edit
                    </button>

                    {product.isActive ? (
                      <button
                        className="button button-danger"
                        onClick={() => onDeactivate(product.id)}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className="button button-secondary"
                        onClick={() => onRestore(product.id)}
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}