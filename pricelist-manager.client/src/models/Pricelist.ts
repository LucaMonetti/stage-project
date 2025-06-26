import { z } from "zod/v4";
import { ProductLiteArraySchema } from "./ProductLite";
import { PricelistLiteSchema } from "./PricelistLite";
import { CompanyLiteSchema } from "./CompanyLite";

export const PricelistSchema = PricelistLiteSchema.extend({
  company: CompanyLiteSchema,
  products: ProductLiteArraySchema.optional(),
});

export type Pricelist = z.infer<typeof PricelistSchema>;

export const PricelistArraySchema = z.array(PricelistSchema);
