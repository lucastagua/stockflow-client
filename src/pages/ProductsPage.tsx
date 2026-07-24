import { useCallback, useEffect, useState } from "react";
import {
  createProduct,
  deactivateProduct,
  getProducts,
  restoreProduct,
  updateProduct
} from "../api/productsApi";
import type {
  Product,
  ProductFormValues,
  ProductSortBy,
  SortDirection,
} from "../types/product";
import { getActiveCategories } from "../api/categoriesApi";
import type { Category } from "../types/category";
import { getApiErrorMessage } from "../api/apiError";
import { PageHeader } from "../components/PageHeader";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";
import { Pagination } from "../components/Pagination";
import { ProductForm } from "../components/ProductForm";


export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [lowStock, setLowStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<ProductSortBy>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState<ProductFormValues>({
    name: "",
    brand: "",
    sku: "",
    costUsd: 0,
    profitMarginPercentage: 30,
    stock: 0,
    minimumStock: 3,
    categoryId: 0,
  });
  const [newProduct, setNewProduct] = useState<ProductFormValues>({
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
      sortBy,
      sortDirection,
    });

    setProducts(data.data);
    setTotalPages(data.totalPages);
    setTotalRecords(data.totalRecords);
  } catch {
    setError("Could not load products.");
  } finally {
    setIsLoading(false);
  }
}, [pageNumber, pageSize, search, lowStock, selectedCategoryId, selectedStatus, sortBy, sortDirection]);

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

useEffect(() => {
  if (totalPages > 0 && pageNumber > totalPages) {
    setPageNumber(totalPages);
  }
}, [pageNumber, totalPages]);

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

      <ProductForm
        title="Create Product"
        values={newProduct}
        categories={categories}
        submitLabel="Create Product"
        isSubmitting={isCreating}
        onChange={setNewProduct}
        onSubmit={handleCreateProduct}
      />
      
      {editingProductId !== null && (
        <ProductForm
          title="Edit Product"
          values={editProduct}
          categories={categories}
          submitLabel="Save Changes"
          isSubmitting={isCreating}
          onChange={setEditProduct}
          onSubmit={handleUpdateProduct}
          onCancel={handleCancelEditProduct}
        />
      )}

  <div className="products-filters-card">
    <div className="products-filters-row products-filters-main">
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
    </div>

    <div className="products-filters-row products-filters-secondary">
      <select
        value={sortBy}
        onChange={(event) => {
          setSortBy(event.target.value as ProductSortBy);
          setPageNumber(1);
        }}
      >
        <option value="createdAt">Sort by creation date</option>
        <option value="name">Sort by name</option>
        <option value="price">Sort by price</option>
        <option value="stock">Sort by stock</option>
      </select>

      <select
        value={sortDirection}
        onChange={(event) => {
          setSortDirection(event.target.value as SortDirection);
          setPageNumber(1);
        }}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <select
        value={pageSize}
        onChange={(event) => {
          setPageSize(Number(event.target.value));
          setPageNumber(1);
        }}
      >
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
      </select>

      <label className="checkbox-label products-low-stock-filter">
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
  </div>

      <div className="results-summary">
        <span>
          {totalRecords === 1
            ? "1 product found"
            : `${totalRecords} products found`}
        </span>
      </div>

      <ErrorMessage message={error} /> 

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