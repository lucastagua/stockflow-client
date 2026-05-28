import { axiosClient } from "./axiosClient";
import type { Category } from "../types/category";

export async function getActiveCategories() {
  const response = await axiosClient.get<Category[]>("/Categories", {
    params: {
      isActive: true,
    },
  });

  return response.data;
}