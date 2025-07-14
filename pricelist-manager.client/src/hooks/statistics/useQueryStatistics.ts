import { useQuery } from "@tanstack/react-query";
import { API_OPTIONS_GET, queryEndpoint } from "../../config/apiConfig";
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

// Fetch the product statistics from the API
const fetchProductStatistics = async (): Promise<ProductStatistics> => {
  const response = await fetch(
    queryEndpoint("statistics/products"),
    API_OPTIONS_GET
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
    queryEndpoint("statistics/products?companyId=" + companyId),
    API_OPTIONS_GET
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
    queryEndpoint("statistics/pricelists"),
    API_OPTIONS_GET
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
    queryEndpoint("statistics/pricelists?companyId=" + companyId),
    API_OPTIONS_GET
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
    queryEndpoint("statistics/companies"),
    API_OPTIONS_GET
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
    queryEndpoint("statistics/accounts"),
    API_OPTIONS_GET
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
