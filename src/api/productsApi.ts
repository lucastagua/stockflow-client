import { axiosClient } from "./axiosClient";
import type {
  CreateProductRequest,
  PagedResponse,
  Product,
  ProductFilters,
} from "../types/product";

export async function getProducts(filters: ProductFilters) {
  const response = await axiosClient.get<PagedResponse<Product>>("/Products", {
    params: {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      search: filters.search || undefined,
      categoryId: filters.categoryId,
      isActive: filters.isActive,
      lowStock: filters.lowStock || undefined,
    },
  });

  return response.data;
}

export async function createProduct(product: CreateProductRequest) {
  const response = await axiosClient.post<Product>("/Products", product);

  return response.data;
}

export async function deactivateProduct(productId: number) {
  await axiosClient.delete(`/Products/${productId}`);
}

export async function restoreProduct(productId: number) {
  await axiosClient.patch(`/Products/${productId}/restore`);
}