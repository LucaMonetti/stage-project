import { z } from "zod/v4";

export const UserLoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type UserLogin = z.infer<typeof UserLoginSchema>;
