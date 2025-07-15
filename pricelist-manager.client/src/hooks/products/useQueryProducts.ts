import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ProductArraySchema,
  ProductSchema,
  type Product,
} from "../../models/Product";
import { API_OPTIONS_GET, queryEndpoint } from "../../config/apiConfig";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

export interface PaginationParams {
  CurrentPage?: number;
  TotalPages?: number;
  PageSize?: number;
  TotalCount?: number;
  HasPrevious?: boolean;
  HasNext?: boolean;
}

export interface ProductFilters {
  productCode?: string;
  companyId?: string;
}

// Fetch all products from the API
const fetchAllProducts = async (
  params: PaginationParams,
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> => {
  const searchParams = new URLSearchParams();
  if (params.CurrentPage) {
    searchParams.append("Pagination.PageNumber", params.CurrentPage.toString());
  }
  if (params.PageSize) {
    searchParams.append("Pagination.PageSize", params.PageSize.toString());
  }

  if (filters) {
    if (filters.productCode) {
      searchParams.append("Filters.ProductCode", filters.productCode);
    }
    if (filters.companyId) {
      searchParams.append("Filters.CompanyId", filters.companyId);
    }
  }

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

  const paginationHeader = response.headers.get("X-Pagination");

  console.log("Pagination Header:", paginationHeader);

  let paginationInfo: PaginationInfo;

  if (paginationHeader) {
    const parsed = JSON.parse(paginationHeader);
    paginationInfo = {
      currentPage: parsed.CurrentPage || 1,
      totalPages: parsed.TotalPages || 1,
      totalCount: parsed.TotalCount || 0,
      pageSize: parsed.PageSize || 10,
      hasPrevious: parsed.HasPrevious || false,
      hasNext: parsed.HasNext || false,
    };
  } else {
    paginationInfo = {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      pageSize: 10,
      hasPrevious: false,
      hasNext: false,
    };
  }

  const rawData = await response.json();
  return {
    items: ProductArraySchema.parse(rawData),
    pagination: paginationInfo,
  };
};

export const useAllProducts = (
  params: PaginationParams,
  filters?: ProductFilters
) => {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ["products", params.CurrentPage, params.PageSize, filters],
    queryFn: () => fetchAllProducts(params, filters),
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
