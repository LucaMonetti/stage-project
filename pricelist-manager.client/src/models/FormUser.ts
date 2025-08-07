import { z } from "zod/v4";

// User
export const CreateUserSchema = z.object({
  firstName: z.string().min(1, "Necessario inserire il nome dell'Utente."),
  lastName: z.string().min(1, "Necessario inserire il cognome dell'Utente."),
  username: z.string().min(1, "Necessario inserire lo username dell'Utente."),
  email: z.email().min(1, "Necessario inserire la email dell'Utente."),
  phone: z.string().nullable(),
  companyId: z.string().min(1, "Necessario inserire il codice di un'Azienda."),
  password: z.string().min(1, "Necessario inserire una password per l'Utente"),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const CreateUserArrraySchema = z.array(CreateUserSchema);

// Edit User
export const EditUserSchema = CreateUserSchema.omit({ password: true }).extend({
  id: z.guid(),
});

export type EditUser = z.infer<typeof EditUserSchema>;

export const EditUserArrraySchema = z.array(EditUserSchema);

// Change Password
export const ChangePasswordSchema = z
  .object({
    id: z.guid(),
    oldPassword: z.string().min(1, "Necessario inserire la vecchia password."),
    newPassword: z.string().min(1, "Necessario inserire la nuova password."),
    confirmPassword: z
      .string()
      .min(1, "Necessario confermare la nuova password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Le nuove password non coincidono.",
  });

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
