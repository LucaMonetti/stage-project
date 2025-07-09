import { useQuery } from "@tanstack/react-query";
import {
  CompanyArraySchema,
  CompanySchema,
  type Company,
} from "../../models/Company";
import { API_OPTIONS_GET, queryEndpoint } from "../../config/apiConfig";

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
