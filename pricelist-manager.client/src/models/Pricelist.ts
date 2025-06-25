import { z } from "zod/v4";
import { CompanySchema } from "./Company";
import { ProductArraySchema } from "./Product";

// Pricelist
export const PricelistNoProdsSchema = z.object({
  id: z.guid(),
  name: z.string(),
  description: z.string(),
});

export type PricelistNoProds = z.infer<typeof PricelistNoProdsSchema>;

export const PricelistNoProdsArraySchema = z.array(PricelistNoProdsSchema);

export const PricelistSchema = PricelistNoProdsSchema.extend({
  company: CompanySchema,
  products: ProductArraySchema.optional(),
});

export type Pricelist = z.infer<typeof PricelistSchema>;

export const PricelistArraySchema = z.array(PricelistSchema);

// Pricelist Statistics
export const PricelistStatisticsSchema = z.object({
  totalRegistered: z.int(),
});

export type PricelistStatistics = z.infer<typeof PricelistStatisticsSchema>;
