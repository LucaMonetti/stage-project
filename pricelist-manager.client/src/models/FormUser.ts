import { z } from "zod/v4";

// User
export const CreateUserSchema = z.object({
  firstName: z.string().min(1, "Necessario inserire il nome dell'Utente."),
  lastName: z.string().min(1, "Necessario inserire il cognome dell'Utente."),
  username: z.string().min(1, "Necessario inserire lo username dell'Utente."),
  email: z.email().min(1, "Necessario inserire la email dell'Utente."),
  phone: z.string(),
  companyId: z.string().min(1, "Necessario inserire il codice di un'Azienda."),
  role: z.string(),
  password: z.string().min(1, "Necessario inserire una password per l'Utente"),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const CreateUserArrraySchema = z.array(CreateUserSchema);

// Edit User
export const EditUserSchema = CreateUserSchema.extend({
  id: z.guid(),
  password: z.string().optional(),
});

export type EditUser = z.infer<typeof EditUserSchema>;

export const EditUserArrraySchema = z.array(EditUserSchema);
