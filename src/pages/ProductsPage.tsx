import { useEffect, useState } from "react";
import { getProducts } from "../api/productsApi";
import type { Product } from "../types/product";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [lowStock, setLowStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProducts({
          pageNumber,
          pageSize: 10,
          search,
          lowStock,
        });

        setProducts(data.data);
        setTotalPages(data.totalPages);
      } catch {
        setError("Could not load products.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [pageNumber, search, lowStock]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product inventory, pricing and stock status.</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by name, brand or SKU..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPageNumber(1);
          }}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(event) => {
              setLowStock(event.target.checked);
              setPageNumber(1);
            }}
          />
          Low stock only
        </label>
      </div>

      {isLoading && <p>Loading products...</p>}

      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <>
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
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={9}>No products found.</td>
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
                      <td>US$ {product.costUsd.toLocaleString("es-AR")}</td>
                      <td>{product.profitMarginPercentage}%</td>
                      <td>
                        ${product.priceArs.toLocaleString("es-AR")}
                      </td>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber((current) => current - 1)}
            >
              Previous
            </button>

            <span>
              Page {pageNumber} of {totalPages}
            </span>

            <button
              disabled={pageNumber === totalPages}
              onClick={() => setPageNumber((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}