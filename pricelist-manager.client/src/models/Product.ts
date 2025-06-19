import { z } from "zod/v4";

// Product Instance
export const ProductInstanceSchema = z.object({
  pricelistId: z.string(),
  id: z.string(),
  version: z.int().nonnegative(),
  name: z.string().min(2, "The name must be at least 2 characters long!"),
  description: z.string(),
  price: z.number().nonnegative(),
});

export const ProductInstanceArraySchema = z.array(ProductInstanceSchema);

export type ProductInstance = z.infer<typeof ProductInstanceSchema>;

// Product
export const ProductSchema = z.object({
  pricelistId: z.string(),
  productCode: z.string(),
  latestVersion: z.int().nonnegative(),
  versions: z.array(ProductInstanceSchema),
});

export const ProductArraySchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;

// Product Statistics
export const ProductStatisticsSchema = z.object({
  totalUniqueProducts: z.int(),
  productCount: z.int(),
});

export type ProductStatistics = z.infer<typeof ProductStatisticsSchema>;
