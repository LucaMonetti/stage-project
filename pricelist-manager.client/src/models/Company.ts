import { z } from "zod/v4";
import { ProductLiteArraySchema } from "./ProductLite";
import { CompanyLiteSchema } from "./CompanyLite";
import { PricelistLiteArraySchema } from "./PricelistLite";

// Company
export const CompanySchema = CompanyLiteSchema.extend({
  products: ProductLiteArraySchema,
  pricelists: PricelistLiteArraySchema,
});

export const CompanyArraySchema = z.array(CompanySchema);

export type Company = z.infer<typeof CompanySchema>;
