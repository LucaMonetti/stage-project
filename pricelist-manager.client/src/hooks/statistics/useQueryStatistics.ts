import { useQuery } from "@tanstack/react-query";
import {
  ProductStatisticsSchema,
  type ProductStatistics,
} from "../../models/ProductStatistics";
import {
  PricelistStatisticsSchema,
  type PricelistStatistics,
} from "../../models/PricelistStatistics";
import {
  CompanyStatisticsSchema,
  type CompanyStatistics,
} from "../../models/CompanyStatistics";
import { UserStatisticsSchema, type UserStatistics } from "../../models/User";
import QueryEndpoint from "../../helpers/queryEndpoint";
import { apiConfig } from "../../helpers/ApiConfig";

// Fetch the product statistics from the API
const fetchProductStatistics = async (): Promise<ProductStatistics> => {
  const response = await fetch(
    QueryEndpoint.buildUrl("statistics/products"),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch product statistics");
  }
  const rawData = await response.json();
  return ProductStatisticsSchema.parse(rawData);
};

export const useProductStatistics = () => {
  return useQuery<ProductStatistics>({
    queryKey: ["statistics", "products"],
    queryFn: fetchProductStatistics,
  });
};

// Fetch the product statistics from the API
const fetchProductStatisticsByCompany = async (
  companyId: string
): Promise<ProductStatistics> => {
  const response = await fetch(
    QueryEndpoint.buildUrl("statistics/products?companyId=" + companyId),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch product statistics");
  }
  const rawData = await response.json();
  return ProductStatisticsSchema.parse(rawData);
};

export const useProductStatisticsByCompany = (companyId: string) => {
  return useQuery<ProductStatistics>({
    queryKey: ["statistics", "products", companyId],
    queryFn: () => fetchProductStatisticsByCompany(companyId),
  });
};

// Fetch the pricelist statistics from the API
const fetchPricelistStatistics = async (): Promise<PricelistStatistics> => {
  const response = await fetch(
    QueryEndpoint.buildUrl("statistics/pricelists"),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch pricelists statistics");
  }
  const rawData = await response.json();
  return PricelistStatisticsSchema.parse(rawData);
};

export const usePricelistStatistics = () => {
  return useQuery<PricelistStatistics>({
    queryKey: ["statistics", "pricelists"],
    queryFn: fetchPricelistStatistics,
  });
};

// Fetch the pricelist statistics from the API
const fetchPricelistStatisticsByCompany = async (
  companyId: string
): Promise<PricelistStatistics> => {
  const response = await fetch(
    QueryEndpoint.buildUrl("statistics/pricelists?companyId=" + companyId),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch pricelists statistics");
  }
  const rawData = await response.json();
  return PricelistStatisticsSchema.parse(rawData);
};

export const usePricelistStatisticsByCompany = (companyId: string) => {
  return useQuery<PricelistStatistics>({
    queryKey: ["statistics", "pricelists", companyId],
    queryFn: () => fetchPricelistStatisticsByCompany(companyId),
  });
};

// Fetch the companies statistics from the API
const fetchCompanyStatistics = async (): Promise<CompanyStatistics> => {
  const response = await fetch(
    QueryEndpoint.buildUrl("statistics/companies"),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch companies statistics");
  }
  const rawData = await response.json();
  return CompanyStatisticsSchema.parse(rawData);
};

export const useCompanyStatistics = () => {
  return useQuery<CompanyStatistics>({
    queryKey: ["statistics", "companies"],
    queryFn: fetchCompanyStatistics,
  });
};

// Fetch the pricelist statistics from the API
const fetchUserStatistics = async (): Promise<UserStatistics> => {
  const response = await fetch(
    QueryEndpoint.buildUrl("statistics/accounts"),
    apiConfig.get()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch product statistics");
  }
  const rawData = await response.json();
  return UserStatisticsSchema.parse(rawData);
};

export const useUserStatistics = () => {
  return useQuery<UserStatistics>({
    queryKey: ["statistics", "users"],
    queryFn: fetchUserStatistics,
  });
};
