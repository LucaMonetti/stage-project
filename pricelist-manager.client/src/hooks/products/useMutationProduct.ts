import {
  type CreateProduct,
  CreateProductSchema,
} from "../../models/FormProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductSchema, type Product } from "../../models/Product";
import { API_OPTIONS_POST, queryEndpoint } from "../../config/apiConfig";

interface UseCreateProductOptions {
  onSuccess?: (data: Product) => void;
  onError?: (error: Error) => void;
}
const createProduct = async (
  createProductData: CreateProduct
): Promise<Product> => {
  const parsedData = CreateProductSchema.safeParse(createProductData);

  if (!parsedData.success) {
    throw new Error("Invalid product data");
  }

  const options = {
    ...API_OPTIONS_POST,
    body: JSON.stringify(parsedData.data),
  };

  const response = await fetch(queryEndpoint(`products`), options);

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  const rawData = await response.json();
  return ProductSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for creating posts
export const useCreateProduct = (options?: UseCreateProductOptions) => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProduct>({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
