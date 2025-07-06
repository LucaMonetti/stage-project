import { z } from "zod/v4";
import { UpdateListProductArraySchema } from "./UpdateListProduct";
import { Status } from "../types";

// Create
export const CreateUpdateListSchema = z.object({
  name: z.string(),
  description: z.string(),
  products: UpdateListProductArraySchema,
});

export type CreateUpdateList = z.infer<typeof CreateUpdateListSchema>;

// Create
export const UpdateUpdateListSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(Status).optional(),
});

export type UpdateUpdateList = z.infer<typeof UpdateUpdateListSchema>;

// AddProducts
export const AddProductsUpdateListSchema = z.object({
  id: z.string(),
  productIds: z.array(z.string()),
});

export type AddProductsUpdateList = z.infer<typeof AddProductsUpdateListSchema>;
