import { useCallback, useEffect, useState } from "react";
import {
  createCategory,
  deactivateCategory,
  getCategories,
  restoreCategory,
} from "../api/categoriesApi";
import { getApiErrorMessage } from "../api/apiError";
import type { Category } from "../types/category";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getCategories({
        search,
        isActive:
          selectedStatus === "all"
            ? undefined
            : selectedStatus === "active",
      });

      setCategories(data);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load categories."));
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedStatus]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsCreating(true);
      setError("");

      await createCategory({
        name: newCategoryName,
        isActive: true,
      });

      setNewCategoryName("");
      await fetchCategories();
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not create category."));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeactivateCategory(categoryId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this category?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await deactivateCategory(categoryId);
      await fetchCategories();
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not deactivate category."));
    }
  }

  async function handleRestoreCategory(categoryId: number) {
    try {
      setError("");
      await restoreCategory(categoryId);
      await fetchCategories();
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not restore category."));
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage product categories used across your inventory.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleCreateCategory}>
        <h2>Create Category</h2>

        <div className="form-grid form-grid-compact">
          <label className="form-field">
            <span>Name</span>
            <input
              type="text"
              placeholder="Example: Electronics"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              required
            />
          </label>
        </div>

        <button className="button button-primary" type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Category"}
        </button>
      </form>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={selectedStatus}
          onChange={(event) =>
            setSelectedStatus(event.target.value as "all" | "active" | "inactive")
          }
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4}>No categories found.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>
                      <span
                        className={
                          category.isActive
                            ? "badge badge-success"
                            : "badge badge-muted"
                        }
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {new Date(category.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td>
                      {category.isActive ? (
                        <button
                          className="button button-danger"
                          onClick={() => handleDeactivateCategory(category.id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="button button-secondary"
                          onClick={() => handleRestoreCategory(category.id)}
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
      )}
    </div>
  );
}