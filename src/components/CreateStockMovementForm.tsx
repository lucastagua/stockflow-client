import type { Product } from "../types/product";
import type { StockMovementType } from "../types/stockMovement";

interface StockMovementFormValues {
  productId: number;
  type: StockMovementType;
  quantity: number;
  reason: string;
}

interface CreateStockMovementFormProps {
  products: Product[];
  values: StockMovementFormValues;
  isCreating: boolean;
  onChange: (values: StockMovementFormValues) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CreateStockMovementForm({
  products,
  values,
  isCreating,
  onChange,
  onSubmit,
}: CreateStockMovementFormProps) {
  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h2>Create Stock Movement</h2>

      <div className="form-grid form-grid-stock-movement">
        <label className="form-field">
          <span>Product</span>
          <select
            value={values.productId}
            onChange={(event) =>
              onChange({
                ...values,
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
            value={values.type}
            onChange={(event) =>
              onChange({
                ...values,
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
            value={values.quantity}
            onChange={(event) =>
              onChange({
                ...values,
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
            value={values.reason}
            onChange={(event) =>
              onChange({
                ...values,
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
  );
}