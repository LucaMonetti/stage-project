import {
  type CreatePricelist,
  CreatePricelistSchema,
} from "../../models/FormPricelist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PricelistSchema, type Pricelist } from "../../models/Pricelist";
import { API_OPTIONS_POST, queryEndpoint } from "../../config/apiConfig";

interface UseCreatePricelistOptions {
  onSuccess?: (data: Pricelist) => void;
  onError?: (error: Error) => void;
}
const createPricelist = async (
  createPricelistData: CreatePricelist
): Promise<Pricelist> => {
  const parsedData = CreatePricelistSchema.safeParse(createPricelistData);

  if (!parsedData.success) {
    throw new Error("Invalid pricelist data");
  }

  const options = {
    ...API_OPTIONS_POST,
    body: JSON.stringify(parsedData.data),
  };

  const response = await fetch(queryEndpoint(`pricelists`), options);

  if (!response.ok) {
    throw new Error("Failed to create pricelist");
  }

  const rawData = await response.json();
  return PricelistSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for creating posts
export const useCreatePricelist = (options?: UseCreatePricelistOptions) => {
  const queryClient = useQueryClient();

  return useMutation<Pricelist, Error, CreatePricelist>({
    mutationFn: createPricelist,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pricelists"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
