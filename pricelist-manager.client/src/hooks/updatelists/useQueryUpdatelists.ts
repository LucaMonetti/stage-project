import { ParsePaginationHeader } from "./../../helpers/Pagination";
import { useQuery } from "@tanstack/react-query";
import {
  UpdateListArraySchema,
  UpdateListSchema,
  type UpdateList,
  type UpdateListFilter,
} from "../../models/UpdateList";
import { Status } from "../../types";
import {
  UpdateListProductArraySchema,
  type UpdateListProduct,
} from "../../models/UpdateListProduct";
import type {
  PaginatedResponse,
  PaginationParams,
} from "../../models/Pagination";
import { ParsePaginationSearchParams } from "../../helpers/Pagination";
import {
  ParseFiltersSearchParams,
  type FilterConfig,
} from "../../helpers/Filters";
import QueryEndpoint from "../../helpers/queryEndpoint";
import { apiConfig } from "../../helpers/ApiConfig";

// Fetch all updatelists from the API
const fetchAllUpdateLists = async (): Promise<UpdateList[]> => {
  const response = await fetch(
    QueryEndpoint.buildUrl("updatelists"),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch updatelists");
  }
  const rawData = await response.json();
  return UpdateListArraySchema.parse(rawData);
};

export const useAllUpdateLists = () => {
  return useQuery<UpdateList[]>({
    queryKey: ["updatelists"],
    queryFn: fetchAllUpdateLists,
  });
};

const updatelistFilterConfig: FilterConfig<UpdateListFilter> = {
  name: {
    paramName: "Filters.Name",
  },
  status: {
    paramName: "Filters.Status",
  },
  companyId: {
    paramName: "Filters.CompanyId",
  },
};

// Fetch all updatelists from the API
const fetchAllUpdateListsPaged = async (
  params: PaginationParams,
  filters?: UpdateListFilter
): Promise<PaginatedResponse<UpdateList>> => {
  const searchParams = new URLSearchParams();

  console.log(
    "Fetching updatelists with params:",
    params,
    "and filters:",
    filters
  );

  ParsePaginationSearchParams(params, searchParams);
  ParseFiltersSearchParams(filters, searchParams, updatelistFilterConfig);

  const response = await fetch(
    QueryEndpoint.buildUrl(
      "updatelists" +
        (searchParams.toString() ? `?${searchParams.toString()}` : "")
    ),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch updatelists");
  }

  const paginationInfo = ParsePaginationHeader(response);

  const rawData = await response.json();
  return {
    items: UpdateListArraySchema.parse(rawData),
    pagination: paginationInfo,
  };
};

export const useAllUpdateListsPaged = (
  params: PaginationParams,
  filters?: UpdateListFilter
) => {
  return useQuery<PaginatedResponse<UpdateList>>({
    queryKey: [
      "updatelists",
      params.CurrentPage ?? 1,
      params.PageSize ?? 0,
      filters,
    ],
    queryFn: () => fetchAllUpdateListsPaged(params, filters),
  });
};

// Fetch a single updatelist by ID from the API
const fetchUpdateList = async (updatelistId: string): Promise<UpdateList> => {
  const response = await fetch(
    QueryEndpoint.buildUrl(`updatelists/${updatelistId}`),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch updatelist");
  }
  const rawData = await response.json();
  return UpdateListSchema.parse(rawData);
};

export const useUpdateList = (updatelistId: string) => {
  return useQuery<UpdateList>({
    queryKey: ["updatelists", updatelistId],
    queryFn: () => fetchUpdateList(updatelistId),
  });
};

// Fetch a single updatelist by ID from the API
const fetchProductToUpdatelistByStatus = async (
  updatelistId: string,
  status: Status,
  params: PaginationParams
): Promise<PaginatedResponse<UpdateListProduct>> => {
  const searchParams = new URLSearchParams();

  ParsePaginationSearchParams(params, searchParams);

  const response = await fetch(
    QueryEndpoint.buildUrl(
      `updatelists/${updatelistId}/products?${searchParams.toString()}&Filters.Status=${status}`
    ),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch updatelist");
  }

  const paginationInfo = ParsePaginationHeader(response);

  const rawData = await response.json();

  return {
    items: UpdateListProductArraySchema.parse(rawData),
    pagination: paginationInfo,
  };
};

export const useProductsByStatus = (
  updatelistId: string,
  status: Status,
  params: PaginationParams
) => {
  return useQuery<PaginatedResponse<UpdateListProduct>>({
    queryKey: [
      "updatelists",
      updatelistId,
      "products-to-updatelist",
      params?.CurrentPage ?? 1,
      params?.PageSize ?? 0,
      status,
    ],
    queryFn: () =>
      fetchProductToUpdatelistByStatus(updatelistId, status, params),
  });
};

const updatelistFilterConfigByCompany: FilterConfig<UpdateListFilter> = {
  name: {
    paramName: "Filters.Name",
  },
  status: {
    paramName: "Filters.Status",
  },
};

// Fetch all updatelists from the API
const fetchAllUpdateListsByCompany = async (
  companyId: string,
  params: PaginationParams,
  filters?: UpdateListFilter
): Promise<PaginatedResponse<UpdateList>> => {
  const searchParams = new URLSearchParams();
  ParsePaginationSearchParams(params, searchParams);
  ParseFiltersSearchParams(
    filters,
    searchParams,
    updatelistFilterConfigByCompany
  );

  const response = await fetch(
    QueryEndpoint.buildUrl(
      `companies/${companyId}/updatelists` +
        (searchParams.toString() ? `?${searchParams.toString()}` : "")
    ),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch updatelists");
  }

  const paginationInfo = ParsePaginationHeader(response);

  const rawData = await response.json();
  return {
    items: UpdateListArraySchema.parse(rawData),
    pagination: paginationInfo,
  };
};

export const useAllUpdateListsByCompany = (
  companyId: string,
  params: PaginationParams,
  filters?: UpdateListFilter
) => {
  return useQuery<PaginatedResponse<UpdateList>>({
    queryKey: [
      "companies",
      companyId,
      "updatelists",
      params.CurrentPage ?? 1,
      params.PageSize ?? 0,
      filters,
    ],
    queryFn: () => fetchAllUpdateListsByCompany(companyId, params, filters),
  });
};
