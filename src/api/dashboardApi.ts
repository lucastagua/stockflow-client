import { axiosClient } from "./axiosClient";
import type { DashboardSummary } from "../types/dashboard";

export interface DashboardFilters {
  from?: string;
  to?: string;
}

export async function getDashboardSummary(filters?: DashboardFilters) {
  const response = await axiosClient.get<DashboardSummary>("/Dashboard/summary", {
    params: {
      from: filters?.from || undefined,
      to: filters?.to || undefined,
    },
  });

  return response.data;
}