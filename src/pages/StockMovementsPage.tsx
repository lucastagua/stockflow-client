import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/apiError";
import { getProducts } from "../api/productsApi";
import {
  createStockMovement,
  getStockMovements,
} from "../api/stockMovementsApi";
import type { Product } from "../types/product";
import type {
  StockMovement,
  StockMovementType,
} from "../types/stockMovement";
import { PageHeader } from "../components/PageHeader";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";
import { Pagination } from "../components/Pagination";
import { StockMovementsFilters } from "../components/StockMovementsFilters";
import { StockMovementsTable } from "../components/StockMovementsTable";
import {
  mapStockMovementTypeToApiType,
  type StockMovementTypeFilter,
} from "../utils/filterMappers";
import { DEFAULT_PAGE_SIZE } from "../constants/pagination";

export function StockMovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [selectedType, setSelectedType] = useState<StockMovementTypeFilter>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMovement, setNewMovement] = useState({
    productId: 0,
    type: 1 as StockMovementType,
    quantity: 1,
    reason: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const fetchMovements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getStockMovements({
        productId: selectedProductId === 0 ? undefined : selectedProductId,
        type: mapStockMovementTypeToApiType(selectedType),
        from,
        to,
        pageNumber,
        pageSize,
      });

      setMovements(data.data);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load stock movements."));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProductId, selectedType, from, to, pageNumber, pageSize]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts({
          pageNumber: 1,
          pageSize: 100,
        });

        setProducts(data.data);
      } catch (error) {
        setError(getApiErrorMessage(error, "Could not load products."));
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    if (totalPages > 0 && pageNumber > totalPages) {
      setPageNumber(totalPages);
    }
  }, [pageNumber, totalPages]);

  async function handleCreateStockMovement(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (newMovement.productId === 0) {
    setError("Please select a product.");
    return;
  }

  if (newMovement.quantity <= 0) {
    setError("Quantity must be greater than zero.");
    return;
  }

  try {
    setIsCreating(true);
    setError("");

    await createStockMovement({
      productId: newMovement.productId,
      type: newMovement.type,
      quantity: newMovement.quantity,
      reason: newMovement.reason || undefined,
    });

    setNewMovement({
      productId: 0,
      type: 1,
      quantity: 1,
      reason: "",
    });

    await fetchMovements();

    const productsData = await getProducts({
      pageNumber: 1,
      pageSize: 100,
    });

    setProducts(productsData.data);
  } catch (error) {
    setError(getApiErrorMessage(error, "Could not create stock movement."));
  } finally {
    setIsCreating(false);
  }
}

  return (
    <div>
      <PageHeader
        title="Stock Movements"
        description="Review stock entries, exits and manual adjustments."
      />

      <form className="form-card" onSubmit={handleCreateStockMovement}>
        <h2>Create Stock Movement</h2>

        <div className="form-grid form-grid-stock-movement">
          <label className="form-field">
            <span>Product</span>
            <select
              value={newMovement.productId}
              onChange={(event) =>
                setNewMovement({
                  ...newMovement,
                  productId: Number(event.target.value),
                })
              }
            >
              <option value={0}>Select product</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - Current stock: {product.stock}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Type</span>
            <select
              value={newMovement.type}
              onChange={(event) =>
                setNewMovement({
                  ...newMovement,
                  type: Number(event.target.value) as StockMovementType,
                })
              }
            >
              <option value={1}>In</option>
              <option value={2}>Out</option>
              <option value={3}>Adjustment</option>
            </select>
          </label>

          <label className="form-field">
            <span>Quantity</span>
            <input
              type="number"
              min="1"
              value={newMovement.quantity}
              onChange={(event) =>
                setNewMovement({
                  ...newMovement,
                  quantity: Number(event.target.value),
                })
              }
            />
          </label>

          <label className="form-field">
            <span>Reason</span>
            <input
              type="text"
              placeholder="Example: Supplier purchase"
              value={newMovement.reason}
              onChange={(event) =>
                setNewMovement({
                  ...newMovement,
                  reason: event.target.value,
                })
              }
            />
          </label>
        </div>

        <button className="button button-primary" type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Movement"}
        </button>
      </form>

      <StockMovementsFilters
        selectedProductId={selectedProductId}
        selectedType={selectedType}
        from={from}
        to={to}
        pageSize={pageSize}
        products={products}
        onProductChange={(value) => {
          setSelectedProductId(value);
          setPageNumber(1);
        }}
        onTypeChange={(value) => {
          setSelectedType(value);
          setPageNumber(1);
        }}
        onFromChange={(value) => {
          setFrom(value);
          setPageNumber(1);
        }}
        onToChange={(value) => {
          setTo(value);
          setPageNumber(1);
        }}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPageNumber(1);
        }}
      />

      <div className="results-summary">
        <span>
          {totalRecords === 1
            ? "1 movement found"
            : `${totalRecords} movements found`}
        </span>
      </div>

        <ErrorMessage message={error} />

      {isLoading ? (
        <LoadingState message="Loading stock movements..." />
      ) : (
        <>
          <StockMovementsTable movements={movements} />

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