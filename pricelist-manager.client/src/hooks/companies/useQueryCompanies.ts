import { useQuery } from "@tanstack/react-query";
import {
  CompanyArraySchema,
  CompanySchema,
  type Company,
  type CompanyFilter,
} from "../../models/Company";
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

// Fetch all products from the API
const fetchAllCompanies = async (): Promise<Company[]> => {
  const response = await fetch(queryEndpoint("companies"), API_OPTIONS_GET);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const rawData = await response.json();
  return CompanyArraySchema.parse(rawData);
};

export const useAllCompanies = () => {
  return useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: fetchAllCompanies,
  });
};

const CompanyFilterConfig: FilterConfig<CompanyFilter> = {
  name: {
    paramName: "Filters.Name",
  },
};

// Fetch all products from the API
const fetchAllCompaniesPaginated = async (
  params: PaginationParams,
  filters?: CompanyFilter
): Promise<PaginatedResponse<Company>> => {
  const searchParams = new URLSearchParams();
  ParsePaginationSearchParams(params, searchParams);
  ParseFiltersSearchParams(filters, searchParams, CompanyFilterConfig);

  const response = await fetch(
    queryEndpoint(
      "companies" +
        (searchParams.toString() ? `?${searchParams.toString()}` : "")
    ),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const paginationInfo = ParsePaginationHeader(response);

  const rawData = await response.json();
  return {
    items: CompanyArraySchema.parse(rawData),
    pagination: paginationInfo,
  };
};

export const useAllCompaniesPaginated = (
  params: PaginationParams,
  filters?: CompanyFilter
) => {
  console.log("useAllCompaniesPaginated", params, filters);

  return useQuery<PaginatedResponse<Company>>({
    queryKey: ["companies", params, filters],
    queryFn: () => fetchAllCompaniesPaginated(params, filters),
  });
};

// Fetch a single company by ID from the API
const fetchCompany = async (productId: string): Promise<Company> => {
  const response = await fetch(
    queryEndpoint(`companies/${productId}`),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  const rawData = await response.json();
  return CompanySchema.parse(rawData);
};

export const useCompany = (productId: string) => {
  return useQuery<Company>({
    queryKey: ["company", productId],
    queryFn: () => fetchCompany(productId),
  });
};
