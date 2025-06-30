import { z } from "zod/v4";

// Create Pricelist
export const CreatePricelistSchema = z.object({
  name: z.string().min(1, "Necessario inserire il nome del Listino!"),
  description: z.string(),
  companyId: z.string().min(1, "Necessario inserire il codice dell'Azienda!"),
});

export const CreatePricelistArraySchema = z.array(CreatePricelistSchema);

export type CreatePricelist = z.infer<typeof CreatePricelistSchema>;

// Edit Pricelist
export const EditPricelistSchema = CreatePricelistSchema.extend({
  id: z.guid(),
});

export const EditPricelistArraySchema = z.array(EditPricelistSchema);

export type EditPricelist = z.infer<typeof EditPricelistSchema>;
