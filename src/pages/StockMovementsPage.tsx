import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/apiError";
import { getProducts } from "../api/productsApi";
import { getStockMovements } from "../api/stockMovementsApi";
import type { Product } from "../types/product";
import type {
  StockMovement,
  StockMovementType,
} from "../types/stockMovement";
import { PageHeader } from "../components/PageHeader";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";
import { Pagination } from "../components/Pagination";

function getMovementTypeLabel(type: StockMovementType) {
  if (type === 1) return "In";
  if (type === 2) return "Out";
  if (type === 3) return "Adjustment";

  return "Unknown";
}

function getMovementBadgeClass(type: StockMovementType) {
  if (type === 1) return "badge badge-success";
  if (type === 2) return "badge badge-warning";

  return "badge badge-muted";
}

export function StockMovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedProductId, setSelectedProductId] = useState(0);
  const [selectedType, setSelectedType] = useState<
    "all" | "in" | "out" | "adjustment"
  >("all");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMovements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getStockMovements({
        productId: selectedProductId === 0 ? undefined : selectedProductId,
        type:
          selectedType === "all"
            ? undefined
            : selectedType === "in"
            ? 1
            : selectedType === "out"
            ? 2
            : 3,
        from,
        to,
        pageNumber,
        pageSize: 10,
      });

      setMovements(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load stock movements."));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProductId, selectedType, from, to, pageNumber]);

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

  return (
    <div>
      <PageHeader
        title="Stock Movements"
        description="Review stock entries, exits and manual adjustments."
      />

      <div className="toolbar">
        <select
          value={selectedProductId}
          onChange={(event) => {
            setSelectedProductId(Number(event.target.value));
            setPageNumber(1);
          }}
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
          onChange={(event) => {
            setSelectedType(
              event.target.value as "all" | "in" | "out" | "adjustment"
            );
            setPageNumber(1);
          }}
        >
          <option value="all">All movement types</option>
          <option value="in">In</option>
          <option value="out">Out</option>
          <option value="adjustment">Adjustment</option>
        </select>

        <input
          type="date"
          value={from}
          onChange={(event) => {
            setFrom(event.target.value);
            setPageNumber(1);
          }}
        />

        <input
          type="date"
          value={to}
          onChange={(event) => {
            setTo(event.target.value);
            setPageNumber(1);
          }}
        />
      </div>

        <ErrorMessage message={error} />

      {isLoading ? (
        <LoadingState message="Loading stock movements..." />
      ) : (
        <>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Previous Stock</th>
                  <th>New Stock</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No stock movements found.</td>
                  </tr>
                ) : (
                  movements.map((movement) => (
                    <tr key={movement.id}>
                      <td>
                        {new Date(movement.createdAt).toLocaleDateString(
                          "es-AR"
                        )}
                      </td>
                      <td>{movement.productName}</td>
                      <td>
                        <span className={getMovementBadgeClass(movement.type)}>
                          {getMovementTypeLabel(movement.type)}
                        </span>
                      </td>
                      <td>{movement.quantity}</td>
                      <td>{movement.previousStock}</td>
                      <td>{movement.newStock}</td>
                      <td>{movement.reason ?? "-"}</td>
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