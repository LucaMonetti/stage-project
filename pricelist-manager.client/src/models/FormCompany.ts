import { z } from "zod/v4";

// Edit Copany
export const EditCopanySchema = z.object({
  name: z
    .string()
    .min(1, "Necessario inserire la Ragione Sociale dell'Azienda!"),
  postlCode: z
    .string()
    .min(5, "Il Codice Postale deve avere 5 caratteri!")
    .max(5, "Il Codice Postale deve avere 5 caratteri!"),
  address: z.string().min(1, "Necessario inserire l'indirizzo dell'azienda!"),
  province: z.string().min(1, "Necessario inserire la Provincia dell'azienda!"),
  phone: z
    .string()
    .min(
      1,
      "Necessario inserire un recapito telefonico in fomato internazionale!"
    ),
  logoUri: z.url(),
  interfaceColor: z
    .string()
    .min(
      1,
      "Necessario inserire un colore per l'Interfaccia della Dashboard Aziendale!"
    ),
});

export const EditCopanyArraySchema = z.array(EditCopanySchema);

export type EditCopany = z.infer<typeof EditCopanySchema>;

// Create Copany
export const CreateCopanySchema = EditCopanySchema.extend({
  id: z.string().min(1, "Necessario inserire il codice dell'Azienda!"),
});

export const CreateCopanyArraySchema = z.array(CreateCopanySchema);

export type CreateCopany = z.infer<typeof CreateCopanySchema>;
