import { z } from "zod/v4";

// Product Instance
export const ProductInstanceSchema = z.object({
  version: z.int().nonnegative(),
  name: z.string().min(2, "The name must be at least 2 characters long!"),
  description: z.string(),
  price: z.number().nonnegative(),
  cost: z.number().nonnegative(),
  accountingControl: z.string().optional(),
  cda: z.string().optional(),
  salesItem: z.string().optional(),
});

export const ProductInstanceArraySchema = z.array(ProductInstanceSchema);

export type ProductInstance = z.infer<typeof ProductInstanceSchema>;
