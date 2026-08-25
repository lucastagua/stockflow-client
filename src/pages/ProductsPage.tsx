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
import { ProductsFilters } from "../components/ProductsFilters";
import { ProductsTable } from "../components/ProductsTable";
import {
  mapProductStatusToIsActive,
  type ProductStatusFilter,
} from "../utils/filterMappers";
import { DEFAULT_PAGE_SIZE } from "../constants/pagination";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [lowStock, setLowStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<ProductStatusFilter>("all");
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
      isActive: mapProductStatusToIsActive(selectedStatus),
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

const hasActiveFilters =
  search.trim() !== "" ||
  selectedCategoryId !== 0 ||
  selectedStatus !== "all" ||
  sortBy !== "createdAt" ||
  sortDirection !== "desc" ||
  pageSize !== DEFAULT_PAGE_SIZE ||
  lowStock;

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

      <ProductsFilters
        search={search}
        selectedCategoryId={selectedCategoryId}
        selectedStatus={selectedStatus}
        sortBy={sortBy}
        sortDirection={sortDirection}
        pageSize={pageSize}
        lowStock={lowStock}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={(value) => {
          setSearch(value);
          setPageNumber(1);
        }}
        onCategoryChange={(value) => {
          setSelectedCategoryId(value);
          setPageNumber(1);
        }}
        onStatusChange={(value) => {
          setSelectedStatus(value);
          setPageNumber(1);
        }}
        onSortByChange={(value) => {
          setSortBy(value);
          setPageNumber(1);
        }}
        onSortDirectionChange={(value) => {
          setSortDirection(value);
          setPageNumber(1);
        }}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPageNumber(1);
        }}
        onLowStockChange={(value) => {
          setLowStock(value);
          setPageNumber(1);
        }}
        onClearFilters={() => {
          setSearch("");
          setSelectedCategoryId(0);
          setSelectedStatus("all");
          setSortBy("createdAt");
          setSortDirection("desc");
          setPageSize(DEFAULT_PAGE_SIZE);
          setLowStock(false);
          setPageNumber(1);
        }}
      />

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
          <ProductsTable
            products={products}
            onEdit={handleStartEditProduct}
            onDeactivate={handleDeactivateProduct}
            onRestore={handleRestoreProduct}
          />

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