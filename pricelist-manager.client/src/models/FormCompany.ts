import { z } from "zod/v4";

// Edit Company
export const EditCompanySchema = z.object({
  id: z.string().min(1, "Necessario inserire il codice dell'Azienda!"),
  name: z
    .string()
    .min(1, "Necessario inserire la Ragione Sociale dell'Azienda!"),
  postalCode: z
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
  interfaceColor: z
    .string()
    .min(
      1,
      "Necessario inserire un colore per l'Interfaccia della Dashboard Aziendale!"
    ),
});

export const EditCompanyArraySchema = z.array(EditCompanySchema);

export type EditCompany = z.infer<typeof EditCompanySchema>;

// Create Company
export const CreateCompanySchema = EditCompanySchema.extend({
  logo: z.instanceof(FileList).refine((filelist) => filelist.length > 0, {
    message: "Necessario inserire un logo per l'Azienda!",
  }),
});

export const CreateCompanyArraySchema = z.array(CreateCompanySchema);

export type CreateCompany = z.infer<typeof CreateCompanySchema>;
