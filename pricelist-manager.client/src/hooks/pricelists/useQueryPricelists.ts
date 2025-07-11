import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PricelistArraySchema,
  PricelistSchema,
  type Pricelist,
} from "../../models/Pricelist";
import { API_OPTIONS_GET, queryEndpoint } from "../../config/apiConfig";

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
