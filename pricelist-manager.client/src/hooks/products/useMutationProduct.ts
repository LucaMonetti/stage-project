import { EditProductSchema } from "./../../models/FormProduct";
import {
  type CreateProduct,
  CreateProductSchema,
  type EditProduct,
} from "../../models/FormProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductSchema, type Product } from "../../models/Product";
import {
  API_OPTIONS_POST,
  API_OPTIONS_PUT,
  queryEndpoint,
} from "../../config/apiConfig";
import type { UseCreateOptions, UseEditOptions } from "../../types";

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
export const useCreateProduct = (options?: UseCreateOptions<Product>) => {
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

// Edit product function
const editProduct = async (
  productId: string,
  updateProductData: EditProduct
): Promise<Product> => {
  const parsedData = EditProductSchema.safeParse(updateProductData);

  if (!parsedData.success) {
    throw new Error("Invalid product data for update");
  }

  const options = {
    ...API_OPTIONS_PUT,
    body: JSON.stringify(parsedData.data),
  };

  const response = await fetch(queryEndpoint(`products/${productId}`), options);

  if (!response.ok) {
    throw new Error(`Failed to update product with ID: ${productId}`);
  }

  const rawData = await response.json();
  return ProductSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for editing products
export const useEditProduct = (options?: UseEditOptions<Product>) => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, EditProduct>({
    mutationFn: (data) => editProduct(data.productId, data),
    onSuccess: (data) => {
      // Invalidate queries to ensure the cache is updated
      queryClient.invalidateQueries({ queryKey: ["products", data.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
