import type { URLSearchParams } from "url";
import type { PaginationInfo, PaginationParams } from "../models/Pagination";

export const ParsePaginationHeader = (response: Response): PaginationInfo => {
  const header = response.headers.get("X-Pagination");

  if (header) {
    const parsed = JSON.parse(header);
    return {
      currentPage: parsed.CurrentPage || 1,
      totalPages: parsed.TotalPages || 1,
      totalCount: parsed.TotalCount || 0,
      pageSize: parsed.PageSize || 10,
      hasPrevious: parsed.HasPrevious || false,
      hasNext: parsed.HasNext || false,
    };
  }

  return {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
    hasPrevious: false,
    hasNext: false,
  };
};

export const ParsePaginationSearchParams = (
  params: PaginationParams,
  searchParams: URLSearchParams
) => {
  if (params.CurrentPage) {
    searchParams.append("Pagination.PageNumber", params.CurrentPage.toString());
  }
  if (params.PageSize) {
    searchParams.append("Pagination.PageSize", params.PageSize.toString());
  }
};
