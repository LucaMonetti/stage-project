import { z } from "zod/v4";
import { ProductInstanceSchema } from "./ProductInstance";

export const Status = {
  Edited: 0,
  Pending: 1,
  Deleted: 2,
} as const;

export type Status = (typeof Status)[keyof typeof Status];

// Product
export const UpdateListProduct = z.object({
  id: z.string(),
  latestVersion: z.number(),
  currentInstance: ProductInstanceSchema,
});

export const UpdateListProductArraySchema = z.array(UpdateListProduct);

export type UpdateListProduct = z.infer<typeof UpdateListProduct>;
