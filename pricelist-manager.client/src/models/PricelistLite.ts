import { z } from "zod/v4";

// Pricelist
export const PricelistLiteSchema = z.object({
  id: z.guid(),
  name: z.string(),
  description: z.string(),
});

export const PricelistLiteArraySchema = z.array(PricelistLiteSchema);

export type PricelistLite = z.infer<typeof PricelistLiteSchema>;
