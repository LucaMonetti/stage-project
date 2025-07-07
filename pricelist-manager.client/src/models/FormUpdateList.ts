import { z } from "zod/v4";

// Create
export const CreateUpdateListSchema = z.object({
  name: z.string(),
  description: z.string(),
  products: z.array(z.string()),
});

export type CreateUpdateList = z.infer<typeof CreateUpdateListSchema>;

// Create
export const EditUpdateListSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export type EditUpdateList = z.infer<typeof EditUpdateListSchema>;

// AddProducts
export const AddProductsUpdateListSchema = z.object({
  id: z.string(),
  productIds: z.array(z.string()),
});

export type AddProductsUpdateList = z.infer<typeof AddProductsUpdateListSchema>;
