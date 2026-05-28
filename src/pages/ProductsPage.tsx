import { useCallback, useEffect, useState } from "react";
import {
  createProduct,
  deactivateProduct,
  getProducts,
  restoreProduct,
} from "../api/productsApi";
import type { Product } from "../types/product";
import { getActiveCategories } from "../api/categoriesApi";
import type { Category } from "../types/category";


export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [lowStock, setLowStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    sku: "",
    costUsd: 0,
    profitMarginPercentage: 30,
    stock: 0,
    minimumStock: 3,
    categoryId: 0,
  });

  const fetchProducts = useCallback(async () => {
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
}, [pageNumber, search, lowStock]);

useEffect(() => {
  fetchProducts();
}, [fetchProducts]);

useEffect(() => {
  async function fetchCategories() {
    try {
      const data = await getActiveCategories();
      setCategories(data);
    } catch {
      setError("Could not load categories.");
    }
  }

  fetchCategories();
}, []);

  async function handleDeactivateProduct(productId: number) {
  const confirmed = window.confirm(
    "Are you sure you want to deactivate this product?"
  );

  if (!confirmed) return;

  try {
    await deactivateProduct(productId);
    await fetchProducts();
  } catch {
    setError("Could not deactivate product.");
  }
}

async function handleRestoreProduct(productId: number) {
  try {
    await restoreProduct(productId);
    await fetchProducts();
  } catch {
    setError("Could not restore product.");
  }
}

async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (newProduct.categoryId === 0) {
    setError("Please select a category.");
    return;
  }

  try {
    setIsCreating(true);
    setError("");

    await createProduct({
      name: newProduct.name,
      brand: newProduct.brand || undefined,
      sku: newProduct.sku || undefined,
      costUsd: Number(newProduct.costUsd),
      profitMarginPercentage: Number(newProduct.profitMarginPercentage),
      stock: Number(newProduct.stock),
      minimumStock: Number(newProduct.minimumStock),
      categoryId: Number(newProduct.categoryId),
    });

    setNewProduct({
      name: "",
      brand: "",
      sku: "",
      costUsd: 0,
      profitMarginPercentage: 30,
      stock: 0,
      minimumStock: 3,
      categoryId: 0,
    });

    await fetchProducts();
  } catch {
    setError("Could not create product.");
  } finally {
    setIsCreating(false);
  }
}

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product inventory, pricing and stock status.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleCreateProduct}>
        <h2>Create Product</h2>

        <div className="form-grid">
          <label className="form-field">
            <span>Name</span>
            <input
              type="text"
              placeholder="Example: Mechanical Keyboard"
              value={newProduct.name}
              onChange={(event) =>
                setNewProduct({ ...newProduct, name: event.target.value })
              }
              required
            />
          </label>

          <label className="form-field">
            <span>Brand</span>
            <input
              type="text"
              placeholder="Example: Logitech"
              value={newProduct.brand}
              onChange={(event) =>
                setNewProduct({ ...newProduct, brand: event.target.value })
              }
            />
          </label>

          <label className="form-field">
            <span>SKU</span>
            <input
              type="text"
              placeholder="Example: LOG-MOUSE-001"
              value={newProduct.sku}
              onChange={(event) =>
                setNewProduct({ ...newProduct, sku: event.target.value })
              }
            />
          </label>

          <label className="form-field">
            <span>Category</span>
            <select
              value={newProduct.categoryId}
              onChange={(event) =>
                setNewProduct({
                  ...newProduct,
                  categoryId: Number(event.target.value),
                })
              }
              required
            >
              <option value={0}>Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Cost USD</span>
            <input
              type="number"
              placeholder="Example: 45"
              value={newProduct.costUsd}
              onChange={(event) =>
                setNewProduct({
                  ...newProduct,
                  costUsd: Number(event.target.value),
                })
              }
              min="0"
              step="0.01"
              required
            />
          </label>

          <label className="form-field">
            <span>Profit Margin %</span>
            <input
              type="number"
              placeholder="Example: 35"
              value={newProduct.profitMarginPercentage}
              onChange={(event) =>
                setNewProduct({
                  ...newProduct,
                  profitMarginPercentage: Number(event.target.value),
                })
              }
              min="0"
              step="0.01"
              required
            />
          </label>

          <label className="form-field">
            <span>Initial Stock</span>
            <input
              type="number"
              placeholder="Example: 10"
              value={newProduct.stock}
              onChange={(event) =>
                setNewProduct({
                  ...newProduct,
                  stock: Number(event.target.value),
                })
              }
              min="0"
              required
            />
          </label>

          <label className="form-field">
            <span>Minimum Stock</span>
            <input
              type="number"
              placeholder="Example: 3"
              value={newProduct.minimumStock}
              onChange={(event) =>
                setNewProduct({
                  ...newProduct,
                  minimumStock: Number(event.target.value),
                })
              }
              min="0"
              required
            />
          </label>
        </div>

        <button className="button button-primary" type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Product"}
        </button>
      </form>

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
                      <td>
                        {product.isActive ? (
                          <button
                            className="button button-danger"
                            onClick={() => handleDeactivateProduct(product.id)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="button button-secondary"
                            onClick={() => handleRestoreProduct(product.id)}
                          >
                            Restore
                          </button>
                        )}
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