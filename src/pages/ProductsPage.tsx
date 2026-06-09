import { useCallback, useEffect, useState } from "react";
import {
  createProduct,
  deactivateProduct,
  getProducts,
  restoreProduct,
  updateProduct
} from "../api/productsApi";
import type { Product } from "../types/product";
import { getActiveCategories } from "../api/categoriesApi";
import type { Category } from "../types/category";
import { getApiErrorMessage } from "../api/apiError";
import { PageHeader } from "../components/PageHeader";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";
import { Pagination } from "../components/Pagination";


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
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState({
    name: "",
    brand: "",
    sku: "",
    costUsd: 0,
    profitMarginPercentage: 30,
    stock: 0,
    minimumStock: 3,
    categoryId: 0,
  });
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
      categoryId: selectedCategoryId === 0 ? undefined : selectedCategoryId,
      isActive:
        selectedStatus === "all"
          ? undefined
          : selectedStatus === "active",
    });

    setProducts(data.data);
    setTotalPages(data.totalPages);
  } catch {
    setError("Could not load products.");
  } finally {
    setIsLoading(false);
  }
}, [pageNumber, search, lowStock, selectedCategoryId, selectedStatus]);

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
  } catch (error) {
    setError(getApiErrorMessage(error, "Could not deactivate product."));
  }
}

async function handleRestoreProduct(productId: number) {
  try {
    await restoreProduct(productId);
    await fetchProducts();
  } catch (error) {
    setError(getApiErrorMessage(error, "Could not restore product."));
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
  } catch (error) {
    setError(getApiErrorMessage(error, "Could not create product."));
  } finally {
    setIsCreating(false);
  }
}

function handleStartEditProduct(product: Product) {
  setEditingProductId(product.id);

  setEditProduct({
    name: product.name,
    brand: product.brand ?? "",
    sku: product.sku ?? "",
    costUsd: product.costUsd,
    profitMarginPercentage: product.profitMarginPercentage,
    stock: product.stock,
    minimumStock: product.minimumStock,
    categoryId: product.categoryId,
  });

  setError("");
}

function handleCancelEditProduct() {
  setEditingProductId(null);

  setEditProduct({
    name: "",
    brand: "",
    sku: "",
    costUsd: 0,
    profitMarginPercentage: 30,
    stock: 0,
    minimumStock: 3,
    categoryId: 0,
  });

  setError("");
}

async function handleUpdateProduct(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (editingProductId === null) return;

  if (editProduct.categoryId === 0) {
    setError("Please select a category.");
    return;
  }

  try {
    setIsCreating(true);
    setError("");

    await updateProduct(editingProductId, {
      name: editProduct.name,
      brand: editProduct.brand || undefined,
      sku: editProduct.sku || undefined,
      costUsd: Number(editProduct.costUsd),
      profitMarginPercentage: Number(editProduct.profitMarginPercentage),
      stock: Number(editProduct.stock),
      minimumStock: Number(editProduct.minimumStock),
      categoryId: Number(editProduct.categoryId),
    });

    handleCancelEditProduct();
    await fetchProducts();
  } catch (error) {
    setError(getApiErrorMessage(error, "Could not update product."));
  } finally {
    setIsCreating(false);
  }
}

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product inventory, pricing and stock status."
      />

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

        <ErrorMessage message={error} />

      </form>

      {editingProductId !== null && (
        <form className="form-card" onSubmit={handleUpdateProduct}>
          <h2>Edit Product</h2>

          <div className="form-grid">
            <label className="form-field">
              <span>Name</span>
              <input
                type="text"
                value={editProduct.name}
                onChange={(event) =>
                  setEditProduct({ ...editProduct, name: event.target.value })
                }
                required
              />
            </label>

            <label className="form-field">
              <span>Brand</span>
              <input
                type="text"
                value={editProduct.brand}
                onChange={(event) =>
                  setEditProduct({ ...editProduct, brand: event.target.value })
                }
              />
            </label>

            <label className="form-field">
              <span>SKU</span>
              <input
                type="text"
                value={editProduct.sku}
                onChange={(event) =>
                  setEditProduct({ ...editProduct, sku: event.target.value })
                }
              />
            </label>

            <label className="form-field">
              <span>Category</span>
              <select
                value={editProduct.categoryId}
                onChange={(event) =>
                  setEditProduct({
                    ...editProduct,
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
                min="0"
                step="0.01"
                value={editProduct.costUsd}
                onChange={(event) =>
                  setEditProduct({
                    ...editProduct,
                    costUsd: Number(event.target.value),
                  })
                }
                required
              />
            </label>

            <label className="form-field">
              <span>Profit Margin %</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editProduct.profitMarginPercentage}
                onChange={(event) =>
                  setEditProduct({
                    ...editProduct,
                    profitMarginPercentage: Number(event.target.value),
                  })
                }
                required
              />
            </label>

            <label className="form-field">
              <span>Stock</span>
              <input
                type="number"
                min="0"
                value={editProduct.stock}
                onChange={(event) =>
                  setEditProduct({
                    ...editProduct,
                    stock: Number(event.target.value),
                  })
                }
                required
              />
            </label>

            <label className="form-field">
              <span>Minimum Stock</span>
              <input
                type="number"
                min="0"
                value={editProduct.minimumStock}
                onChange={(event) =>
                  setEditProduct({
                    ...editProduct,
                    minimumStock: Number(event.target.value),
                  })
                }
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="button button-primary" type="submit" disabled={isCreating}>
              {isCreating ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="button button-secondary"
              type="button"
              onClick={handleCancelEditProduct}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

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

        <select
          value={selectedCategoryId}
          onChange={(event) => {
            setSelectedCategoryId(Number(event.target.value));
            setPageNumber(1);
          }}
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
          onChange={(event) => {
            setSelectedStatus(event.target.value as "all" | "active" | "inactive");
            setPageNumber(1);
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

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

      {isLoading && <LoadingState message="Loading products..." />}

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
                        <div className="table-actions">
                          <button
                            className="button button-secondary"
                            onClick={() => handleStartEditProduct(product)}
                          >
                            Edit
                          </button>

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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            onPageChange={setPageNumber}
          />
        </>
      )}
      
    </div>
  );
}