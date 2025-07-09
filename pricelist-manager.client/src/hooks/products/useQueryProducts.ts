import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ProductArraySchema,
  ProductSchema,
  type Product,
} from "../../models/Product";
import { API_OPTIONS_GET, queryEndpoint } from "../../config/apiConfig";

// Fetch all products from the API
const fetchAllProducts = async (): Promise<Product[]> => {
  const response = await fetch(queryEndpoint("products"), API_OPTIONS_GET);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const rawData = await response.json();
  return ProductArraySchema.parse(rawData);
};

export const useAllProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
  });
};

// Fetch a single product by ID from the API
const fetchProduct = async (productId: string): Promise<Product> => {
  const response = await fetch(
    queryEndpoint(`products/${productId}`),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  const rawData = await response.json();
  return ProductSchema.parse(rawData);
};

export const useProduct = (productId: string) => {
  const queryClient = useQueryClient();

  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    initialData: () => {
      return queryClient
        .getQueryData<Product[]>(["products"])
        ?.find((product) => product.id === productId);
    },
  });
};

// Fetch all the products by pricelist ID from the API
const fetchProductsByPricelist = async (
  pricelistId: string
): Promise<Product[]> => {
  const response = await fetch(
    queryEndpoint(`pricelists/${pricelistId}/products`),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  const rawData = await response.json();
  return ProductArraySchema.parse(rawData);
};

export const useAllProductByPricelist = (pricelistId: string) => {
  const queryClient = useQueryClient();

  return useQuery<Product[]>({
    queryKey: ["products", "pricelist", pricelistId],
    queryFn: () => fetchProductsByPricelist(pricelistId),
    initialData: () => {
      const products = queryClient.getQueryData<Product[]>(["products"]);
      return (
        products?.filter((prod: Product) => prod.pricelistId === pricelistId) ||
        []
      );
    },
  });
};

// Fetch all the products by pricelist ID from the API
const fetchProductsByCompany = async (
  companyId: string
): Promise<Product[]> => {
  const response = await fetch(
    queryEndpoint(`companies/${companyId}/products`),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  const rawData = await response.json();
  return ProductArraySchema.parse(rawData);
};

export const useAllProductsByCompany = (companyId: string) => {
  const queryClient = useQueryClient();

  return useQuery<Product[]>({
    queryKey: ["products", "company", companyId],
    queryFn: () => fetchProductsByCompany(companyId),
    initialData: () => {
      const products = queryClient.getQueryData<Product[]>(["products"]);
      return (
        products?.filter((prod: Product) => prod.companyId === companyId) || []
      );
    },
  });
};
