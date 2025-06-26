import { z } from "zod/v4";
import { ProductLiteSchema } from "./ProductLite";
import { PricelistLiteSchema } from "./PricelistLite";
import { ProductInstanceArraySchema } from "./ProductInstance";
import { CompanyLiteSchema } from "./CompanyLite";

export const ProductSchema = ProductLiteSchema.extend({
  pricelist: z.lazy(() => PricelistLiteSchema),
  versions: ProductInstanceArraySchema,
  company: z.lazy(() => CompanyLiteSchema),
});

export const ProductArraySchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;
