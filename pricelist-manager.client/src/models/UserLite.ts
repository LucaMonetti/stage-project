import { z } from "zod/v4";

// User Lite
export const UserLiteSchema = z.object({
  id: z.guid(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.email(),
  phone: z.string(),
});

export type UserLite = z.infer<typeof UserLiteSchema>;

export const UserLiteArraySchema = z.array(UserLiteSchema);
