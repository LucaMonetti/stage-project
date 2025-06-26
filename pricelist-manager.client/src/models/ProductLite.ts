import { z } from "zod/v4";
import { ProductInstanceSchema } from "./ProductInstance";

// Product
export const ProductLiteSchema = z.object({
  pricelistId: z.guid(),
  id: z.string(),
  latestVersion: z.int().nonnegative(),
  currentInstance: ProductInstanceSchema,
  totalVersions: z.int().nonnegative(),
  companyId: z.string(),
  productCode: z.string(),
});

export const ProductLiteArraySchema = z.array(ProductLiteSchema);

export type ProductLite = z.infer<typeof ProductLiteSchema>;
