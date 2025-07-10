import {
  type CreatePricelist,
  CreatePricelistSchema,
  type EditPricelist,
  EditPricelistSchema,
} from "../../models/FormPricelist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PricelistSchema, type Pricelist } from "../../models/Pricelist";
import {
  API_OPTIONS_POST,
  API_OPTIONS_PUT,
  queryEndpoint,
} from "../../config/apiConfig";
import type { UseEditOptions } from "../../types";
import type { EditCompany } from "../../models/FormCompany";

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

// Edit pricelist function
const editPricelist = async (
  id: string,
  updateData: EditPricelist
): Promise<Pricelist> => {
  const parsedData = EditPricelistSchema.safeParse(updateData);

  if (!parsedData.success) {
    throw new Error("Invalid pricelist data for update");
  }

  const options = {
    ...API_OPTIONS_PUT,
    body: JSON.stringify(parsedData.data),
  };

  const response = await fetch(queryEndpoint(`pricelists/${id}`), options);

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
