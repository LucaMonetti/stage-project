import { z } from "zod/v4";
import { ProductInstanceSchema } from "./ProductInstance";
import { Status } from "../types";

// Product
export const UpdateListProduct = z.object({
  id: z.string(),
  latestVersion: z.number(),
  currentInstance: ProductInstanceSchema,
  prevInstance: ProductInstanceSchema.optional(),
  status: z.enum(Status),
});

export const UpdateListProductArraySchema = z.array(UpdateListProduct);

export type UpdateListProduct = z.infer<typeof UpdateListProduct>;
