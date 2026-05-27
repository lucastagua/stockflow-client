import { axiosClient } from "./axiosClient";
import type { PagedResponse, Product, ProductFilters } from "../types/product";

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