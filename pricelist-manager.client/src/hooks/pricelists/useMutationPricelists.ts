import {
  type CreatePricelist,
  CreatePricelistSchema,
  type EditPricelist,
  EditPricelistSchema,
} from "../../models/FormPricelist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PricelistSchema, type Pricelist } from "../../models/Pricelist";
import type { UseEditOptions } from "../../types";
import QueryEndpoint from "../../helpers/queryEndpoint";
import { apiConfig } from "../../helpers/ApiConfig";
import type { PricelistLite } from "../../models/PricelistLite";

interface UseCreatePricelistOptions {
  onSuccess?: (data: PricelistLite) => void;
  onError?: (error: Error) => void;
}
const createPricelist = async (
  createPricelistData: CreatePricelist
): Promise<Pricelist> => {
  const parsedData = CreatePricelistSchema.safeParse(createPricelistData);

  if (!parsedData.success) {
    throw new Error("Invalid pricelist data");
  }

  const response = await fetch(
    QueryEndpoint.buildUrl(`pricelists`),
    apiConfig.post(parsedData.data)
  );

  if (!response.ok) {
    throw new Error("Failed to create pricelist");
  }

  const rawData = await response.json();
  return PricelistSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for creating posts
export const useCreatePricelist = (options?: UseCreatePricelistOptions) => {
  const queryClient = useQueryClient();

  return useMutation<PricelistLite, Error, CreatePricelist>({
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

// Edit pricelist function
const editPricelist = async (
  id: string,
  updateData: EditPricelist
): Promise<Pricelist> => {
  const parsedData = EditPricelistSchema.safeParse(updateData);

  if (!parsedData.success) {
    throw new Error("Invalid pricelist data for update");
  }

  const response = await fetch(
    QueryEndpoint.buildUrl(`pricelists/${id}`),
    apiConfig.put(parsedData.data)
  );

  if (!response.ok) {
    throw new Error(`Failed to update product with ID: ${id}`);
  }

  const rawData = await response.json();
  return PricelistSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for editing pricelist
export const useEditPricelist = (options?: UseEditOptions<Pricelist>) => {
  const queryClient = useQueryClient();

  return useMutation<Pricelist, Error, EditPricelist>({
    mutationFn: (data) => editPricelist(data.id, data),
    onSuccess: (data) => {
      // Invalidate queries to ensure the cache is updated
      queryClient.invalidateQueries({ queryKey: ["pricelists", data.id] });
      queryClient.invalidateQueries({ queryKey: ["pricelists"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};

// Delete Pricelist
const deletePricelist = async (
  pricelistId: string
): Promise<{ pricelistId: string }> => {
  const response = await fetch(
    QueryEndpoint.buildUrl(`pricelists/${pricelistId}`),
    apiConfig.delete()
  );

  if (!response.ok) {
    throw new Error(`Failed to DELETE pricelist ${pricelistId}`);
  }

  return { pricelistId: pricelistId };
};

// Custom hook to encapsulate the useMutation logic for editing updatelist
export const useDeletePricelist = (
  options?: UseEditOptions<{ pricelistId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation<{ pricelistId: string }, Error, { pricelistId: string }>({
    mutationKey: ["pricelists", "delete"],
    mutationFn: (data) => deletePricelist(data.pricelistId),
    onSuccess: (data) => {
      queryClient.removeQueries({
        queryKey: ["pricelists", data.pricelistId],
      });
      queryClient.invalidateQueries({
        queryKey: ["pricelists"],
        refetchType: "all",
      });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
