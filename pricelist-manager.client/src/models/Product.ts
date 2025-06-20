import { z } from "zod/v4";

// Product Instance
export const ProductInstanceSchema = z.object({
  version: z.int().nonnegative(),
  name: z.string().min(2, "The name must be at least 2 characters long!"),
  description: z.string(),
  price: z.number().nonnegative(),
});

export const ProductInstanceArraySchema = z.array(ProductInstanceSchema);

export type ProductInstance = z.infer<typeof ProductInstanceSchema>;

// Product
export const ProductSchema = z.object({
  pricelistId: z.guid(),
  productCode: z.string(),
  latestVersion: z.int().nonnegative(),
  currentInstance: ProductInstanceSchema,
  totalVersions: z.int().nonnegative(),
  companyId: z.string(),
});

export const ProductArraySchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;

// Product Statistics
export const ProductStatisticsSchema = z.object({
  totalRegistered: z.int(),
  uniqueCount: z.int(),
});

export type ProductStatistics = z.infer<typeof ProductStatisticsSchema>;
