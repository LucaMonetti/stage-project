import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PricelistArraySchema,
  PricelistSchema,
  type Pricelist,
  type PricelistFilter,
} from "../../models/Pricelist";
import { API_OPTIONS_GET, queryEndpoint } from "../../config/apiConfig";
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

// Fetch all pricelists from the API
const fetchAllPricelists = async (): Promise<Pricelist[]> => {
  const response = await fetch(queryEndpoint("pricelists"), API_OPTIONS_GET);
  if (!response.ok) {
    throw new Error("Failed to fetch pricelists");
  }
  const rawData = await response.json();
  return PricelistArraySchema.parse(rawData);
};

export const useAllPricelists = () => {
  return useQuery<Pricelist[]>({
    queryKey: ["pricelists"],
    queryFn: fetchAllPricelists,
  });
};

const PricelistFilterConfig: FilterConfig<PricelistFilter> = {
  name: {
    paramName: "Filters.Name",
  },
};

// Fetch all pricelists from the API
const fetchAllPricelistsPaginated = async (
  params: PaginationParams,
  filters?: PricelistFilter
): Promise<PaginatedResponse<Pricelist>> => {
  const searchParams = new URLSearchParams();
  ParsePaginationSearchParams(params, searchParams);
  ParseFiltersSearchParams(filters, searchParams, PricelistFilterConfig);

  const response = await fetch(
    queryEndpoint(
      "pricelists" +
        (searchParams.toString() ? `?${searchParams.toString()}` : "")
    ),
    API_OPTIONS_GET
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
    queryEndpoint(`pricelists/${pricelistId}`),
    API_OPTIONS_GET
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
  companyId: string
): Promise<Pricelist[]> => {
  const response = await fetch(
    queryEndpoint(`companies/${companyId}/pricelists`),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch pricelist");
  }
  const rawData = await response.json();
  return PricelistArraySchema.parse(rawData);
};

export const useAllPricelistsByCompany = (companyId: string) => {
  const queryClient = useQueryClient();

  return useQuery<Pricelist[]>({
    queryKey: ["pricelists", "company", companyId],
    queryFn: () => fetchPricelistsByCompany(companyId),
    initialData: () => {
      return (
        queryClient
          .getQueryData<Pricelist[]>(["pricelists"])
          ?.filter((pricelist) => pricelist.company.id === companyId) ?? []
      );
    },
  });
};
