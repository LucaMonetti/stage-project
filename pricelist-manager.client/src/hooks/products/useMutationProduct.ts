import { EditProductSchema } from "./../../models/FormProduct";
import {
  type CreateProduct,
  CreateProductSchema,
  type EditProduct,
} from "../../models/FormProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductSchema, type Product } from "../../models/Product";
import type { UseCreateOptions, UseEditOptions } from "../../types";
import QueryEndpoint from "../../helpers/queryEndpoint";
import { apiConfig } from "../../helpers/ApiConfig";

const createProduct = async (
  createProductData: CreateProduct
): Promise<Product> => {
  const parsedData = CreateProductSchema.safeParse(createProductData);

  if (!parsedData.success) {
    throw new Error("Invalid product data");
  }

  const response = await fetch(
    QueryEndpoint.buildUrl(`products`),
    apiConfig.post(parsedData.data)
  );

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
  updateProductData: EditProduct,
  editUpdateList?: string
): Promise<Product> => {
  const parsedData = EditProductSchema.safeParse(updateProductData);

  if (!parsedData.success) {
    throw new Error("Invalid product data for update");
  }

  const response = await fetch(
    QueryEndpoint.buildUrl(
      `products/${productId}${
        editUpdateList ? `?editUpdateList=${editUpdateList}` : ""
      }`
    ),
    apiConfig.put(parsedData.data)
  );

  if (!response.ok) {
    throw new Error(`Failed to update product with ID: ${productId}`);
  }

  const rawData = await response.json();
  return ProductSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for editing products
export const useEditProduct = (
  editUpdateList?: string,
  options?: UseEditOptions<Product>
) => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, EditProduct>({
    mutationFn: (data) => editProduct(data.productId, data, editUpdateList),
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
