export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

export interface PaginationParams {
  CurrentPage?: number;
  TotalPages?: number;
  PageSize?: number;
  TotalCount?: number;
  HasPrevious?: boolean;
  HasNext?: boolean;
}
