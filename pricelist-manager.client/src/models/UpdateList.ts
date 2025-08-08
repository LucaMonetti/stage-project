import { z } from "zod/v4";
import { UpdateListProductArraySchema } from "./UpdateListProduct";
import { Status } from "../types";

// Updatelist Schema
export const UpdateListSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  createdAt: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  companyId: z.string(),
  status: z.enum(Status),
  totalProducts: z.number(),
  editedProducts: z.number(),
});

export const UpdateListArraySchema = z.array(UpdateListSchema);

export type UpdateList = z.infer<typeof UpdateListSchema>;

// UpdateListFilter Schema
export const UpdateListFilterSchema = z.object({
  name: z.string().optional(),
  status: z.enum(Status).optional(),
  companyId: z.string().optional(),
});

export type UpdateListFilter = z.infer<typeof UpdateListFilterSchema>;
