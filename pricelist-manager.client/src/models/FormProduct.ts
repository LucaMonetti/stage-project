import { z } from "zod/v4";

// Create Product
export const CreateProductSchema = z.object({
  pricelistId: z.guid("Necessario selezionare un listino prezzi!"),
  productCode: z
    .string()
    .min(1, "Necessario inserire il codice dell'Articolo!"),
  name: z.string().min(1, "Necessario inserire il nome dell'Articolo!"),
  description: z.string(),
  price: z
    .number("Necessario inserire un valore per il prezzo!")
    .nonnegative("Il prezzo non può essere negativo!"),
  cost: z
    .number("Necessario inserire un valore per il costo!")
    .nonnegative("Il costo non può essere negativo!"),
  accountingControl: z.string(),
  cda: z.string(),
  salesItem: z.string(),
});

export const CreateProductArraySchema = z.array(CreateProductSchema);

export type CreateProduct = z.infer<typeof CreateProductSchema>;

// Edit Product
export const EditProductSchema = CreateProductSchema.extend({
  productId: z.string(),
});

export const EditProductArraySchema = z.array(EditProductSchema);

export type EditProduct = z.infer<typeof EditProductSchema>;
