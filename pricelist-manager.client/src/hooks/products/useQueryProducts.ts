import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ProductArraySchema,
  ProductSchema,
  type Product,
  type ProductFilter,
} from "../../models/Product";
import { API_OPTIONS_GET, queryEndpoint } from "../../config/apiConfig";
import type {
  PaginatedResponse,
  PaginationParams,
} from "../../models/Pagination";
import {
  ParsePaginationHeader,
  ParsePaginationSearchParams,
} from "../../helpers/Pagination";
import {
  ParseFiltersSearchParams,
  type FilterConfig,
} from "../../helpers/Filters";

const ProductFilterConfig: FilterConfig<ProductFilter> = {
  productCode: {
    paramName: "Filters.ProductCode",
  },
  companyId: {
    paramName: "Filters.CompanyId",
  },
};

// Fetch all products from the API
const fetchAllProductsPaginated = async (
  params: PaginationParams,
  filters?: ProductFilter
): Promise<PaginatedResponse<Product>> => {
  const searchParams = new URLSearchParams();
  ParsePaginationSearchParams(params, searchParams);
  ParseFiltersSearchParams(filters, searchParams, ProductFilterConfig);

  const response = await fetch(
    queryEndpoint(
      "products" +
        (searchParams.toString() ? `?${searchParams.toString()}` : "")
    ),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const paginationInfo = ParsePaginationHeader(response);

  const rawData = await response.json();
  return {
    items: ProductArraySchema.parse(rawData),
    pagination: paginationInfo,
  };
};

export const useAllProductsPaginated = (
  params: PaginationParams,
  filters?: ProductFilter
) => {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: [
      "products",
      params?.CurrentPage ?? 1,
      params?.PageSize ?? 0,
      filters,
    ],
    queryFn: () => fetchAllProductsPaginated(params, filters),
  });
};
// Fetch all products from the API
const fetchAvailableProducts = async (
  updatelistId: number,
  params: PaginationParams,
  filters?: ProductFilter
): Promise<PaginatedResponse<Product>> => {
  const searchParams = new URLSearchParams();
  ParsePaginationSearchParams(params, searchParams);
  ParseFiltersSearchParams(filters, searchParams, ProductFilterConfig);

  const response = await fetch(
    queryEndpoint(
      `updatelists/${updatelistId}/available-products` +
        (searchParams.toString() ? `?${searchParams.toString()}` : "")
    ),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const paginationInfo = ParsePaginationHeader(response);

  const rawData = await response.json();
  return {
    items: ProductArraySchema.parse(rawData),
    pagination: paginationInfo,
  };
};

export const useAvailableProducts = (
  updatelistId: number,
  params: PaginationParams,
  filters?: ProductFilter
) => {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: [
      "updatelists",
      updatelistId,
      "products",
      params?.CurrentPage ?? 1,
      params?.PageSize ?? 0,
      filters,
    ],
    queryFn: () => fetchAvailableProducts(updatelistId, params, filters),
  });
};

// Fetch all products from the API
const fetchAllProducts = async (
  filters?: ProductFilter
): Promise<Product[]> => {
  const searchParams = new URLSearchParams();
  ParseFiltersSearchParams(filters, searchParams, ProductFilterConfig);

  const response = await fetch(
    queryEndpoint(
      "products" +
        (searchParams.toString() ? `?${searchParams.toString()}` : "")
    ),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const rawData = await response.json();
  return ProductArraySchema.parse(rawData);
};

export const useAllProducts = (filters?: ProductFilter) => {
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: () => fetchAllProducts(filters),
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
