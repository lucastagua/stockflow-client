import { useCallback, useEffect, useState } from "react";
import { cancelSale, createSale, getSales } from "../api/salesApi";
import { getApiErrorMessage } from "../api/apiError";
import type { Sale } from "../types/sale";
import { getProducts } from "../api/productsApi";
import type { Product } from "../types/product";
import { PageHeader } from "../components/PageHeader";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";
import { Pagination } from "../components/Pagination";
import { SalesFilters } from "../components/SalesFilters";
import { SalesTable } from "../components/SalesTable";
import {
  mapSaleStatusToApiStatus,
  type SaleStatusFilter,
} from "../utils/filterMappers";

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<SaleStatusFilter>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [saleItems, setSaleItems] = useState<
    { productId: number; productName: string; quantity: number }[]
  >([]);
  const [isCreating, setIsCreating] = useState(false);

  const fetchSales = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getSales({
        status: mapSaleStatusToApiStatus(selectedStatus),
        from,
        to,
        pageNumber,
        pageSize,
      });

      setSales(data.data);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load sales."));
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, from, to, pageNumber, pageSize]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  useEffect(() => {
  async function fetchActiveProducts() {
    try {
      const data = await getProducts({
        pageNumber: 1,
        pageSize: 100,
        isActive: true,
      });

      setProducts(data.data);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load products."));
    }
  }

  fetchActiveProducts();
  }, []);

  useEffect(() => {
    if (totalPages > 0 && pageNumber > totalPages) {
      setPageNumber(totalPages);
    }
  }, [pageNumber, totalPages]);

  async function handleCancelSale(saleId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this sale? Stock will be restored."
    );

    if (!confirmed) return;

    try {
      setError("");
      await cancelSale(saleId);
      await fetchSales();
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not cancel sale."));
    }
  }

  function handleAddSaleItem() {
  if (selectedProductId === 0) {
    setError("Please select a product.");
    return;
  }

  if (quantity <= 0) {
    setError("Quantity must be greater than zero.");
    return;
  }

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId
  );

  if (!selectedProduct) {
    setError("Selected product was not found.");
    return;
  }

  if (quantity > selectedProduct.stock) {
    setError(`Only ${selectedProduct.stock} units available.`);
    return;
  }

  const alreadyExists = saleItems.some(
    (item) => item.productId === selectedProductId
  );

  if (alreadyExists) {
    setError("This product is already added to the sale.");
    return;
  }

  setSaleItems([
    ...saleItems,
    {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity,
    },
  ]);

  setSelectedProductId(0);
  setQuantity(1);
  setError("");
}

function handleRemoveSaleItem(productId: number) {
  setSaleItems((currentItems) =>
    currentItems.filter((item) => item.productId !== productId)
  );
}

async function handleCreateSale(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (saleItems.length === 0) {
    setError("Sale must contain at least one item.");
    return;
  }

  try {
    setIsCreating(true);
    setError("");

    await createSale({
      items: saleItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    setSaleItems([]);
    await fetchSales();

    const productsData = await getProducts({
      pageNumber: 1,
      pageSize: 100,
      isActive: true,
    });

    setProducts(productsData.data);
  } catch (error) {
    setError(getApiErrorMessage(error, "Could not create sale."));
  } finally {
    setIsCreating(false);
  }
}

  return (
    <div>
      <PageHeader
        title="Sales"
        description="Review sales, filter by status and cancel transactions when needed."
      />

      <form className="form-card" onSubmit={handleCreateSale}>
        <h2>Create Sale</h2>

        <div className="form-grid form-grid-sale">
          <label className="form-field">
            <span>Product</span>
            <select
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(Number(event.target.value))}
            >
              <option value={0}>Select product</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - Stock: {product.stock} - $
                  {product.priceArs.toLocaleString("es-AR")}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Quantity</span>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </label>

          <div className="form-actions-inline">
            <button type="button" className="button button-secondary" onClick={handleAddSaleItem}>
              Add Item
            </button>
          </div>
        </div>

        {saleItems.length > 0 && (
          <div className="sale-items-preview">
            <h3>Sale Items</h3>

            {saleItems.map((item) => (
              <div key={item.productId} className="sale-item-preview-row">
                <span>
                  {item.productName} x{item.quantity}
                </span>

                <button
                  type="button"
                  className="button button-danger"
                  onClick={() => handleRemoveSaleItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="button button-primary" type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Sale"}
        </button>
      </form>
      
      <SalesFilters
        selectedStatus={selectedStatus}
        from={from}
        to={to}
        pageSize={pageSize}
        onStatusChange={(value) => {
          setSelectedStatus(value);
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
            ? "1 sale found"
            : `${totalRecords} sales found`}
        </span>
      </div>

      <ErrorMessage message={error} />

      {isLoading ? (
        <LoadingState message="Loading sales..." />
      ) : (
        <>

          <SalesTable sales={sales} onCancel={handleCancelSale} />

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