import { z } from "zod/v4";

export const AuthenticatedResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export type AuthenticatedResponse = z.infer<typeof AuthenticatedResponseSchema>;
