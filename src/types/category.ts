export interface Category {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  isActive: boolean;
}

export interface CategoryFilters {
  search?: string;
  isActive?: boolean;
}