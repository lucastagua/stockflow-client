import { useCallback, useEffect, useState } from "react";
import {
  createCategory,
  deactivateCategory,
  getCategories,
  restoreCategory,
  updateCategory,
} from "../api/categoriesApi";
import { getApiErrorMessage } from "../api/apiError";
import type { Category } from "../types/category";
import { PageHeader } from "../components/PageHeader";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
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

  function handleStartEditCategory(category: Category) {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
    setError("");
  }

  function handleCancelEditCategory() {
    setEditingCategoryId(null);
    setEditCategoryName("");
    setError("");
  }

  async function handleUpdateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingCategoryId === null) return;

    try {
      setIsUpdating(true);
      setError("");

      await updateCategory(editingCategoryId, {
        name: editCategoryName,
        isActive: true,
      });

      handleCancelEditCategory();
      await fetchCategories();
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not update category."));
    } finally {
      setIsUpdating(false);
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
      <PageHeader
        title="Categories"
        description="Manage product categories used across your inventory."
      />

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

      {editingCategoryId !== null && (
        <form className="form-card" onSubmit={handleUpdateCategory}>
          <h2>Edit Category</h2>

          <div className="form-grid form-grid-compact">
            <label className="form-field">
              <span>Name</span>
              <input
                type="text"
                value={editCategoryName}
                onChange={(event) => setEditCategoryName(event.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button className="button button-primary" type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="button button-secondary"
              type="button"
              onClick={handleCancelEditCategory}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

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

      <ErrorMessage message={error} />

      {isLoading ? (
        <LoadingState message="Loading categories..." />
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
                      <div className="table-actions">
                        <button
                          className="button button-secondary"
                          onClick={() => handleStartEditCategory(category)}
                        >
                          Edit
                        </button>

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
                      </div>
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