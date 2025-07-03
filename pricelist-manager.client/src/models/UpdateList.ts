import { z } from "zod/v4";
import { ProductInstanceSchema } from "./ProductInstance";
import { UpdateListProductArraySchema } from "./UpdateListProduct";

export const Status = {
  Edited: 0,
  Pending: 1,
  Deleted: 2,
} as const;

export type Status = (typeof Status)[keyof typeof Status];

// Product
export const UpdateListSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  createdAt: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  status: z.enum(Status),
  totalProducts: z.number(),
  editeProducts: z.number(),
  products: UpdateListProductArraySchema,
});

export const UpdateListArraySchema = z.array(UpdateListSchema);

export type UpdateList = z.infer<typeof UpdateListSchema>;
