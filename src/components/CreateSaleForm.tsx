import type { Product } from "../types/product";
import { formatCurrencyArs } from "../utils/formatters";

interface SaleFormItem {
  productId: number;
  productName: string;
  quantity: number;
}

interface CreateSaleFormProps {
  products: Product[];
  selectedProductId: number;
  quantity: number;
  saleItems: SaleFormItem[];
  isCreating: boolean;
  onSelectedProductChange: (value: number) => void;
  onQuantityChange: (value: number) => void;
  onAddItem: () => void;
  onRemoveItem: (productId: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CreateSaleForm({
  products,
  selectedProductId,
  quantity,
  saleItems,
  isCreating,
  onSelectedProductChange,
  onQuantityChange,
  onAddItem,
  onRemoveItem,
  onSubmit,
}: CreateSaleFormProps) {
  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h2>Create Sale</h2>

      <div className="form-grid form-grid-sale">
        <label className="form-field">
          <span>Product</span>
          <select
            value={selectedProductId}
            onChange={(event) =>
              onSelectedProductChange(Number(event.target.value))
            }
          >
            <option value={0}>Select product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - Stock: {product.stock} - {formatCurrencyArs(product.priceArs)}
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
            onChange={(event) => onQuantityChange(Number(event.target.value))}
          />
        </label>

        <div className="form-actions-inline">
          <button
            type="button"
            className="button button-secondary"
            onClick={onAddItem}
          >
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
                onClick={() => onRemoveItem(item.productId)}
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
  );
}