import type { Category } from "../types/category";
import type { ProductFormValues } from "../types/product";

interface ProductFormProps {
  title: string;
  values: ProductFormValues;
  categories: Category[];
  submitLabel: string;
  isSubmitting: boolean;
  onChange: (values: ProductFormValues) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

export function ProductForm({
  title,
  values,
  categories,
  submitLabel,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h2>{title}</h2>

      <div className="form-grid">
        <label className="form-field">
          <span>Name</span>
          <input
            type="text"
            value={values.name}
            onChange={(event) =>
              onChange({ ...values, name: event.target.value })
            }
            required
          />
        </label>

        <label className="form-field">
          <span>Brand</span>
          <input
            type="text"
            value={values.brand}
            onChange={(event) =>
              onChange({ ...values, brand: event.target.value })
            }
          />
        </label>

        <label className="form-field">
          <span>SKU</span>
          <input
            type="text"
            value={values.sku}
            onChange={(event) =>
              onChange({ ...values, sku: event.target.value })
            }
          />
        </label>

        <label className="form-field">
          <span>Category</span>
          <select
            value={values.categoryId}
            onChange={(event) =>
              onChange({
                ...values,
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
            value={values.costUsd}
            onChange={(event) =>
              onChange({
                ...values,
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
            value={values.profitMarginPercentage}
            onChange={(event) =>
              onChange({
                ...values,
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
            value={values.stock}
            onChange={(event) =>
              onChange({
                ...values,
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
            value={values.minimumStock}
            onChange={(event) =>
              onChange({
                ...values,
                minimumStock: Number(event.target.value),
              })
            }
            required
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </button>

        {onCancel && (
          <button
            className="button button-secondary"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}