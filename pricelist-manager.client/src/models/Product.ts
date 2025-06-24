import { z } from "zod/v4";
import { PricelistNoProdsSchema } from "./Pricelist";

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

export const ProductWithPricelistSchema = ProductSchema.extend({
  pricelist: z.lazy(() => PricelistNoProdsSchema),
});

export const ProductWithPricelistArraySchema = z.array(
  ProductWithPricelistSchema
);

export type ProductWitPricelist = z.infer<typeof ProductWithPricelistSchema>;

// Create Product

export const CreateProductSchema = z.object({
  pricelistId: z.guid("Necessario selezionare un listino prezzi!"),
  productCode: z
    .string()
    .min(1, "Necessario inserire il nome codice dell'Articolo!"),
  name: z.string().min(1, "Necessario inserire il nome dell'Articolo!"),
  description: z.string(),
  price: z
    .number("Necessario inserire un valore per il prezzo!")
    .nonnegative("Il prezzo non può essere negativo!"),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;

// Product Statistics
export const ProductStatisticsSchema = z.object({
  totalRegistered: z.int(),
  uniqueCount: z.int(),
});

export type ProductStatistics = z.infer<typeof ProductStatisticsSchema>;
