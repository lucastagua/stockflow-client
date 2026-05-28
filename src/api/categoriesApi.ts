import { axiosClient } from "./axiosClient";
import type { Category, CreateCategoryRequest, CategoryFilters } from "../types/category";

export async function getCategories(filters?: CategoryFilters) {
  const response = await axiosClient.get<Category[]>("/Categories", {
    params: {
      search: filters?.search || undefined,
      isActive: filters?.isActive,
    },
  });

  return response.data;
}

export async function getActiveCategories() {
  return getCategories({ isActive: true });
}

export async function createCategory(category: CreateCategoryRequest) {
  const response = await axiosClient.post<Category>("/Categories", category);

  return response.data;
}

export async function deactivateCategory(categoryId: number) {
  await axiosClient.delete(`/Categories/${categoryId}`);
}

export async function restoreCategory(categoryId: number) {
  await axiosClient.patch(`/Categories/${categoryId}/restore`);
}