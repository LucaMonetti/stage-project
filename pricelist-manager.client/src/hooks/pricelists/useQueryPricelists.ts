import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PricelistArraySchema,
  PricelistSchema,
  type Pricelist,
  type PricelistFilter,
} from "../../models/Pricelist";
import type {
  PaginatedResponse,
  PaginationParams,
} from "../../models/Pagination";
import {
  ParsePaginationHeader,
  ParsePaginationSearchParams,
} from "../../helpers/Pagination";
import {
  ParseFiltersSearchParams,
  type FilterConfig,
} from "../../helpers/Filters";
import QueryEndpoint from "../../helpers/queryEndpoint";
import { apiConfig } from "../../helpers/ApiConfig";

const PricelistFilterConfig: FilterConfig<PricelistFilter> = {
  name: {
    paramName: "Filters.Name",
  },
  company_id: {
    paramName: "Filters.CompanyId",
  },
};

// Fetch all pricelists from the API
const fetchAllPricelists = async (
  filter?: PricelistFilter
): Promise<Pricelist[]> => {
  const searchParams = new URLSearchParams();
  ParseFiltersSearchParams(filter, searchParams, PricelistFilterConfig);

  const response = await fetch(
    QueryEndpoint.buildUrl(
      "pricelists" +
        (searchParams.toString() ? `?${searchParams.toString()}` : "")
    ),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch pricelists");
  }
  const rawData = await response.json();
  return PricelistArraySchema.parse(rawData);
};

export const useAllPricelists = (filters?: PricelistFilter) => {
  return useQuery<Pricelist[]>({
    queryKey: ["pricelists", filters],
    queryFn: () => fetchAllPricelists(filters),
  });
};

// Fetch all pricelists from the API
const fetchAllPricelistsPaginated = async (
  params: PaginationParams,
  filters?: PricelistFilter
): Promise<PaginatedResponse<Pricelist>> => {
  const searchParams = new URLSearchParams();
  ParsePaginationSearchParams(params, searchParams);

  console.log("Filtri", filters);

  ParseFiltersSearchParams(filters, searchParams, PricelistFilterConfig);

  const response = await fetch(
    QueryEndpoint.buildUrl(
      "pricelists" +
        (searchParams.toString() ? `?${searchParams.toString()}` : "")
    ),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch pricelists");
  }

  const paginationInfo = ParsePaginationHeader(response);

  const rawData = await response.json();
  return {
    items: PricelistArraySchema.parse(rawData),
    pagination: paginationInfo,
  };
};

export const useAllPricelistsPaginated = (
  params: PaginationParams,
  filters?: PricelistFilter
) => {
  return useQuery<PaginatedResponse<Pricelist>>({
    queryKey: [
      "pricelists",
      params?.CurrentPage ?? 1,
      params?.PageSize ?? 0,
      filters,
    ],
    queryFn: () => fetchAllPricelistsPaginated(params, filters),
  });
};

// Fetch a single pricelist by ID from the API
const fetchPricelist = async (pricelistId: string): Promise<Pricelist> => {
  const response = await fetch(
    QueryEndpoint.buildUrl(`pricelists/${pricelistId}`),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch pricelist");
  }
  const rawData = await response.json();
  return PricelistSchema.parse(rawData);
};

export const usePricelist = (pricelistId: string) => {
  const queryClient = useQueryClient();

  return useQuery<Pricelist>({
    queryKey: ["pricelists", pricelistId],
    queryFn: () => fetchPricelist(pricelistId),
    initialData: () => {
      return queryClient
        .getQueryData<Pricelist[]>(["pricelists"])
        ?.find((pricelist) => pricelist.id === pricelistId);
    },
  });
};

// Fetch a single pricelist by ID from the API
const fetchPricelistsByCompany = async (
  companyId: string,
  params: PaginationParams
): Promise<Pricelist[]> => {
  const searchParams = new URLSearchParams();
  ParsePaginationSearchParams(params, searchParams);

  const response = await fetch(
    QueryEndpoint.buildUrl(
      `companies/${companyId}/pricelists${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`
    ),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch pricelist");
  }
  const rawData = await response.json();
  return PricelistArraySchema.parse(rawData);
};

export const useAllPricelistsByCompany = (
  companyId: string,
  params: PaginationParams
) => {
  const queryClient = useQueryClient();

  return useQuery<Pricelist[]>({
    queryKey: [
      "pricelists",
      "company",
      companyId,
      params.CurrentPage ?? 1,
      params.PageSize ?? 0,
    ],
    queryFn: () => fetchPricelistsByCompany(companyId, params),
    initialData: () => {
      return (
        queryClient
          .getQueryData<Pricelist[]>(["pricelists"])
          ?.filter((pricelist) => pricelist.company.id === companyId) ?? []
      );
    },
  });
};
