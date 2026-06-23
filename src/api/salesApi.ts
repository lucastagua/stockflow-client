import { axiosClient } from "./axiosClient";
import type {
  CreateSaleRequest,
  PagedResponse,
  Sale,
  SaleFilters,
} from "../types/sale";

export async function createSale(sale: CreateSaleRequest) {
  const response = await axiosClient.post<Sale>("/Sales", sale);

  return response.data;
}

export async function getSales(filters: SaleFilters) {
  const response = await axiosClient.get<PagedResponse<Sale>>("/Sales", {
    params: {
      status: filters.status,
      from: filters.from || undefined,
      to: filters.to || undefined,
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
    },
  });

  return response.data;
}

export async function cancelSale(saleId: number) {
  await axiosClient.post(`/Sales/${saleId}/cancel`);
}

export async function getSaleById(saleId: number) {
  const response = await axiosClient.get<Sale>(`/Sales/${saleId}`);

  return response.data;
}