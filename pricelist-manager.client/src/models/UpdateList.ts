import { z } from "zod/v4";
import { UpdateListProductArraySchema } from "./UpdateListProduct";
import { Status } from "../types";

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
  editedProducts: z.number(),
  products: UpdateListProductArraySchema,
});

export const UpdateListArraySchema = z.array(UpdateListSchema);

export type UpdateList = z.infer<typeof UpdateListSchema>;
